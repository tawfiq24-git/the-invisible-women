import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, Square, Copy, Check, Sparkles, Send, Volume2 } from 'lucide-react';
import { getLanguageByCode } from '../data/languages';
import { TTSService } from '../services/ttsService';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onUseTranscript: (transcript: string) => void;
}

export function AudioTranscribeModal({
  isOpen,
  onClose,
  selectedLanguage,
  onUseTranscript,
}: AudioTranscribeModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const langInfo = getLanguageByCode(selectedLanguage);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setIsProcessing(false);
  }, []);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setTranscript('');
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (blob.size < 500) {
          setErrorMessage('Audio clip was too short. Please try speaking again.');
          setIsProcessing(false);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const resultStr = reader.result as string;
            const base64Data = resultStr.includes(',')
              ? resultStr.split(',')[1]
              : resultStr;

            const res = await fetch('/api/gemini/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType,
                language: selectedLanguage,
              }),
            });

            if (!res.ok) throw new Error('Transcription request failed');
            const data = await res.json();
            setTranscript(data.transcript || 'No speech detected in audio.');
          } catch (err) {
            console.error('Transcription error:', err);
            setErrorMessage('Transcription error. Please check your connection and try again.');
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(200);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone error in transcribe:', err);
      setErrorMessage('Could not access microphone. Please grant permission and try again.');
      cleanup();
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToSearch = () => {
    if (!transcript) return;
    onUseTranscript(transcript);
    cleanup();
    onClose();
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Audio Transcription
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Verbatim speech-to-text in {langInfo.name} ({langInfo.nativeName})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Recording Status & Controls */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-center">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                    <Mic className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div className="text-sm font-bold text-stone-900 mb-1">
                  Recording: {recordingSeconds}s
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  Speak clearly into your microphone...
                </p>

                <button
                  onClick={handleStopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Transcribe</span>
                </button>
              </div>
            ) : isProcessing ? (
              <div className="py-6 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <div className="font-bold text-stone-800 text-sm">
                  Transcribing with gemini-3.5-transcribe...
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Generating accurate, verbatim Indic text
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Mic className="w-8 h-8" />
                </div>
                <div className="font-bold text-stone-900 text-base mb-1">
                  Ready to Transcribe
                </div>
                <p className="text-xs text-stone-500 max-w-xs mb-4">
                  Tap below to speak in {langInfo.nativeName} or English.
                </p>

                <button
                  onClick={handleStartRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Transcript Output Box */}
          {transcript && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Transcribed Result
                </span>
                <span className="text-[10px] text-stone-400">
                  model: gemini-3.5-transcribe
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-stone-900 text-sm sm:text-base font-semibold leading-relaxed">
                {transcript}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => TTSService.speak(transcript, langInfo.bcp47)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Listen</span>
                  </button>
                </div>

                <button
                  onClick={handleApplyToSearch}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Search Scheme With This</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
