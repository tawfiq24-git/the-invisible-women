import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, PhoneCall, PhoneOff, Radio, Volume2 } from 'lucide-react';
import { getLanguageByCode } from '../data/languages';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
}

export function LiveVoiceModal({
  isOpen,
  onClose,
  selectedLanguage,
}: LiveVoiceModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap "Start Live Voice Call" to talk directly with AWAAZ');
  const [modelIsSpeaking, setModelIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const langInfo = getLanguageByCode(selectedLanguage);

  const cleanupAudio = useCallback(() => {
    // Stop all playing audio sources
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setModelIsSpeaking(false);
  }, []);

  // Helper to play raw PCM chunk at 24kHz
  const playAudioChunk = useCallback((audioBase64: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const binaryStr = atob(audioBase64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      activeSourcesRef.current.push(source);
      setModelIsSpeaking(true);

      source.onended = () => {
        const idx = activeSourcesRef.current.indexOf(source);
        if (idx !== -1) {
          activeSourcesRef.current.splice(idx, 1);
        }
        if (activeSourcesRef.current.length === 0) {
          setModelIsSpeaking(false);
        }
      };
    } catch (err) {
      console.warn('Live audio playback error:', err);
    }
  }, []);

  const startLiveSession = async () => {
    setErrorMessage(null);
    setIsConnecting(true);
    setStatusMessage('Connecting to Gemini 3.8 Live API...');

    try {
      // 1. Acquire mic stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // 2. Initialize AudioContexts
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;

      // 3. Connect WebSocket to backend Live proxy
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-voice`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setStatusMessage('Live Call Active! Speak naturally in your language.');

        // Stream mic audio to WebSocket as raw PCM 16kHz
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMuted || ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert float32 to 16-bit PCM
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          // Convert Int16Array to base64
          const uint8 = new Uint8Array(pcm16.buffer);
          let binary = '';
          for (let i = 0; i < uint8.byteLength; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const base64 = btoa(binary);
          ws.send(JSON.stringify({ audio: base64 }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
            setStatusMessage('Connection failed: ' + msg.error);
            return;
          }
          if (msg.interrupted) {
            // User interrupted model: stop current audio
            activeSourcesRef.current.forEach((src) => {
              try {
                src.stop();
              } catch {}
            });
            activeSourcesRef.current = [];
            nextStartTimeRef.current = outputAudioCtxRef.current?.currentTime || 0;
            setModelIsSpeaking(false);
          }
          if (msg.audio) {
            playAudioChunk(msg.audio);
          }
        } catch (parseErr) {
          console.warn('WS message error:', parseErr);
        }
      };

      ws.onerror = (err) => {
        console.error('Live WS error:', err);
        setErrorMessage('Unable to connect to live voice server. Please check internet connection.');
        cleanupAudio();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setStatusMessage('Call ended. Tap Start Live Call to reconnect.');
      };
    } catch (err: unknown) {
      console.error('Live call setup failed:', err);
      setIsConnecting(false);
      setErrorMessage('Could not access microphone. Please allow microphone access and try again.');
      cleanupAudio();
    }
  };

  const handleClose = () => {
    cleanupAudio();
    onClose();
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-stone-900 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900/60 via-stone-900 to-amber-900/60 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Real-Time Voice Call
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Bidirectional conversational AI in {langInfo.name} ({langInfo.nativeName})
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-stone-400 hover:text-white" />
          </button>
        </div>

        {/* Body Visualizer */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          {/* Animated Pulsing Sphere */}
          <div className="relative my-4 flex items-center justify-center">
            {isConnected && (
              <>
                <div
                  className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-300 ${
                    modelIsSpeaking
                      ? 'bg-amber-500/30 scale-125 animate-pulse'
                      : 'bg-rose-500/20 scale-100'
                  }`}
                />
                <div
                  className={`absolute -inset-4 rounded-full border-2 transition-all duration-500 ${
                    modelIsSpeaking
                      ? 'border-amber-400/50 animate-ping'
                      : 'border-rose-500/30'
                  }`}
                />
              </>
            )}

            <div
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
                isConnected
                  ? modelIsSpeaking
                    ? 'bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-400 ring-8 ring-amber-500/30 scale-105'
                    : 'bg-gradient-to-tr from-rose-600 via-rose-700 to-stone-800 ring-8 ring-rose-500/20'
                  : 'bg-stone-800 border-2 border-stone-700'
              }`}
            >
              <span className="text-4xl sm:text-5xl" role="img" aria-label="Digital Sister">
                🧕
              </span>
              {isConnected && (
                <div className="absolute -bottom-2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-900 border border-stone-700 text-stone-200">
                  {modelIsSpeaking ? 'Speaking...' : 'Listening...'}
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <p className="text-sm sm:text-base font-semibold text-stone-200 mt-4 max-w-sm">
            {statusMessage}
          </p>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs max-w-md">
              {errorMessage}
            </div>
          )}

          {isConnected && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-400">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Full-duplex conversation • Speak to interrupt at any time</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={startLiveSession}
              disabled={isConnecting}
              className="flex items-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              <PhoneCall className="w-5 h-5 animate-pulse" />
              <span>{isConnecting ? 'Connecting...' : 'Start Live Voice Call'}</span>
            </button>
          ) : (
            <>
              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className={`p-3.5 min-h-[48px] min-w-[48px] rounded-2xl border transition-all active:scale-95 flex items-center justify-center ${
                  isMuted
                    ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* End Call */}
              <button
                onClick={cleanupAudio}
                className="flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/30 transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
