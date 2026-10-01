import { useState, useEffect, useRef, useCallback } from 'react';

// Declare types for Web Speech API
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface MicPermissionDetails {
  state: MicPermissionState;
  isBlocked: boolean;
  title: string;
  message: string;
  browserLabel: string;
  steps: string[];
}

export interface UseSpeechRecognitionOptions {
  onAutoSubmit?: (transcript: string) => void;
  onAudioSubmit?: (audioBase64: string, mimeType: string) => void;
  silenceTimeoutMs?: number;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  setTranscript: (text: string) => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  stopListeningAndSubmit: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  permissionError: string | null;
  permissionState: MicPermissionState;
  permissionDetails: MicPermissionDetails | null;
  isPermissionBlocked: boolean;
  clearError: () => void;
  requestPermissionAndStart: () => Promise<void>;
  audioLevel: number; // 0 to 1 for visualizer feedback
}

/**
 * Detect client browser environment to give exact, tailored permission toggling steps
 */
function getBrowserDetails(): { name: 'chrome' | 'safari' | 'firefox' | 'edge' | 'ios' | 'android' | 'other'; label: string } {
  if (typeof navigator === 'undefined') return { name: 'other', label: 'Browser' };
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);

  if (isIOS) return { name: 'ios', label: 'Safari on iPhone / iPad' };
  if (isAndroid) return { name: 'android', label: 'Mobile Browser' };
  if (ua.includes('edg/')) return { name: 'edge', label: 'Microsoft Edge' };
  if (ua.includes('firefox/')) return { name: 'firefox', label: 'Mozilla Firefox' };
  if (ua.includes('safari/') && !ua.includes('chrome/')) return { name: 'safari', label: 'Apple Safari' };
  return { name: 'chrome', label: 'Google Chrome' };
}

/**
 * Returns user-friendly step-by-step guidance tailored to the user's browser
 */
function getPermissionGuidance(browser: ReturnType<typeof getBrowserDetails>): { title: string; message: string; steps: string[] } {
  if (browser.name === 'ios') {
    return {
      title: 'Microphone is Blocked in Safari',
      message: 'Safari blocked microphone access for this application. You can enable it in two quick taps:',
      steps: [
        'Tap the "aA" or page settings icon on the left side of the Safari address bar.',
        'Tap "Website Settings", then tap "Microphone".',
        'Select "Allow", then return here and tap "Try Again".'
      ]
    };
  }

  if (browser.name === 'android') {
    return {
      title: 'Microphone is Blocked in Mobile Browser',
      message: 'Your browser is currently blocking microphone access for this website:',
      steps: [
        'Tap the lock 🔒 or site settings icon next to the website address.',
        'Tap "Permissions" > "Microphone".',
        'Change it to "Allow", then return here and tap "Try Again".'
      ]
    };
  }

  if (browser.name === 'firefox') {
    return {
      title: 'Microphone is Blocked in Firefox',
      message: 'Firefox has blocked microphone access for this page:',
      steps: [
        'Click the crossed-out microphone or permissions icon on the left of the address bar.',
        'Clear the "Blocked" permission setting.',
        'Tap "Try Again" below and click "Allow" when prompted.'
      ]
    };
  }

  if (browser.name === 'safari') {
    return {
      title: 'Microphone is Blocked in Safari',
      message: 'Safari has blocked microphone access for this site:',
      steps: [
        'Open the Safari menu in your top menu bar > Settings (or Preferences).',
        'Click the "Websites" tab, then select "Microphone" in the left sidebar.',
        'Find this website in the list and set its permission to "Allow".'
      ]
    };
  }

  // Google Chrome / Microsoft Edge / Default desktop
  return {
    title: 'Microphone Access is Blocked in Browser',
    message: 'To speak with AWAAZ, please enable microphone access for this website:',
    steps: [
      'Click the site settings / lock icon (🔒 or 🎛️) on the left side of your address bar.',
      'Locate "Microphone" and switch the setting from "Block" to "Allow".',
      'Click "Try Again" below to speak freely.'
    ]
  };
}

export function useSpeechRecognition(
  langCodeBcp47: string,
  options?: UseSpeechRecognitionOptions
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<MicPermissionState>('prompt');
  const [permissionDetails, setPermissionDetails] = useState<MicPermissionDetails | null>(null);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>('');
  const hasSubmittedRef = useRef<boolean>(false);
  const mimeTypeRef = useRef<string>('audio/webm');

  const silenceTimeoutMs = options?.silenceTimeoutMs || 1500;
  const onAutoSubmit = options?.onAutoSubmit;
  const onAudioSubmit = options?.onAudioSubmit;

  // Sync ref with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Proactively query navigator.permissions to detect current state and listen to live changes
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;

    let permissionStatus: PermissionStatus | null = null;
    let isCancelled = false;

    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((status) => {
        if (isCancelled) return;
        permissionStatus = status;
        const curState = status.state as MicPermissionState;
        setPermissionState(curState);

        if (curState === 'denied') {
          const browser = getBrowserDetails();
          const guidance = getPermissionGuidance(browser);
          setIsPermissionBlocked(true);
          setPermissionDetails({
            state: 'denied',
            isBlocked: true,
            title: guidance.title,
            message: guidance.message,
            browserLabel: browser.label,
            steps: guidance.steps,
          });
        } else if (curState === 'granted') {
          setIsPermissionBlocked(false);
          setPermissionDetails(null);
          setPermissionError(null);
        }

        // Live permission change listener: fires when user toggles permission in browser URL bar!
        status.onchange = () => {
          if (isCancelled) return;
          const nextState = status.state as MicPermissionState;
          setPermissionState(nextState);

          if (nextState === 'granted') {
            setIsPermissionBlocked(false);
            setPermissionDetails(null);
            setPermissionError(null);
          } else if (nextState === 'denied') {
            const browser = getBrowserDetails();
            const guidance = getPermissionGuidance(browser);
            setIsPermissionBlocked(true);
            setPermissionDetails({
              state: 'denied',
              isBlocked: true,
              title: guidance.title,
              message: guidance.message,
              browserLabel: browser.label,
              steps: guidance.steps,
            });
            setPermissionError(`${guidance.title}: ${guidance.steps[0]}`);
          } else {
            setIsPermissionBlocked(false);
            setPermissionDetails(null);
            setPermissionError(null);
          }
        };
      })
      .catch(() => {
        // Permissions query not supported or restricted in this browser environment
      });

    return () => {
      isCancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Cleanup helper for audio tracks & contexts
  const releaseMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const triggerSubmit = useCallback(
    (textToSubmit?: string) => {
      if (hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      // Stop MediaRecorder and grab audio
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }

      setIsListening(false);
      clearSilenceTimer();

      const cleanText = (textToSubmit || transcriptRef.current).trim();

      // If speech recognition produced clean text, use text submission
      if (cleanText.length > 1) {
        releaseMedia();
        onAutoSubmit?.(cleanText);
        return;
      }

      // Otherwise, convert recorded audio blob and send to Gemini audio endpoint
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, {
            type: mimeTypeRef.current || 'audio/webm',
          });
          if (blob.size > 800) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const resultStr = reader.result as string;
              const base64Data = resultStr.includes(',')
                ? resultStr.split(',')[1]
                : resultStr;
              releaseMedia();
              if (base64Data) {
                onAudioSubmit?.(base64Data, blob.type);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
        releaseMedia();
      }, 250);
    },
    [onAutoSubmit, onAudioSubmit, clearSilenceTimer, releaseMedia]
  );

  const startListening = useCallback(async () => {
    setPermissionError(null);
    setPermissionDetails(null);
    setIsPermissionBlocked(false);
    hasSubmittedRef.current = false;
    clearSilenceTimer();
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
    audioChunksRef.current = [];

    // 1. Acquire MediaStream
    let stream: MediaStream | null = null;
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        const guidance = {
          title: 'Audio Not Supported',
          message: 'Your browser environment does not support audio recording. You can type your request directly.',
          steps: ['Please use the keyboard below to type your question.']
        };
        setPermissionState('unsupported');
        setIsPermissionBlocked(true);
        setPermissionDetails({
          state: 'unsupported',
          isBlocked: true,
          title: guidance.title,
          message: guidance.message,
          browserLabel: 'Browser',
          steps: guidance.steps,
        });
        setPermissionError(guidance.message);
        return;
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      setPermissionState('granted');
      setIsPermissionBlocked(false);
      setPermissionDetails(null);
      setPermissionError(null);
    } catch (err: unknown) {
      console.warn('Microphone permission request caught:', err);
      const errName =
        err && typeof err === 'object' && 'name' in err ? String(err.name) : '';
      const errMsg =
        err && typeof err === 'object' && 'message' in err ? String(err.message) : '';

      const isNotAllowed =
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError' ||
        errMsg.toLowerCase().includes('permission denied') ||
        errMsg.toLowerCase().includes('not allowed');

      const isSecurity =
        errName === 'SecurityError' ||
        errMsg.toLowerCase().includes('insecure') ||
        errMsg.toLowerCase().includes('policy');

      const browser = getBrowserDetails();
      const guidance = getPermissionGuidance(browser);

      if (isNotAllowed || isSecurity) {
        setIsPermissionBlocked(true);
        setPermissionState('denied');
        setPermissionDetails({
          state: 'denied',
          isBlocked: true,
          title: guidance.title,
          message: guidance.message,
          browserLabel: browser.label,
          steps: guidance.steps,
        });
        setPermissionError(
          `${guidance.title}. ${guidance.steps[0]}`
        );
      } else {
        setPermissionError(
          'Microphone device error. Please ensure your microphone is plugged in, not used by another call, and try again.'
        );
      }
      return;
    }

    setIsListening(true);

    // 2. Setup AudioContext Volume Analyser
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let speakingStarted = false;

        const checkVolume = () => {
          if (!mediaStreamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(1, avg / 60);
          setAudioLevel(normalized);

          if (normalized > 0.15) {
            speakingStarted = true;
            clearSilenceTimer();
            silenceTimerRef.current = setTimeout(() => {
              if (speakingStarted) {
                triggerSubmit();
              }
            }, silenceTimeoutMs);
          }

          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (ctxErr) {
      console.warn('AudioContext analyser could not be initialized:', ctxErr);
    }

    // 3. Initialize MediaRecorder (universal audio capture)
    try {
      let chosenMime = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          chosenMime = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          chosenMime = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          chosenMime = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          chosenMime = 'audio/ogg';
        }

        mimeTypeRef.current = chosenMime;
        const recorder = new MediaRecorder(stream, { mimeType: chosenMime });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(200);
        mediaRecorderRef.current = recorder;
      }
    } catch (recErr) {
      console.warn('MediaRecorder init error:', recErr);
    }

    // 4. Concurrently start Web Speech Recognition if available (for real-time live typing)
    try {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = langCodeBcp47 || 'ta-IN';

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let currentInterim = '';
          let finalSpeech = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const speech = result[0]?.transcript || '';
            if (result.isFinal) {
              finalSpeech += speech + ' ';
            } else {
              currentInterim += speech;
            }
          }

          if (finalSpeech) {
            setTranscript((prev) => {
              const next = prev
                ? prev + ' ' + finalSpeech.trim()
                : finalSpeech.trim();
              transcriptRef.current = next;
              return next;
            });
          }
          setInterimTranscript(currentInterim);

          const combined = (
            transcriptRef.current +
            ' ' +
            currentInterim
          ).trim();
          if (combined.length > 2) {
            clearSilenceTimer();
            silenceTimerRef.current = setTimeout(() => {
              triggerSubmit(combined);
            }, silenceTimeoutMs);
          }
        };

        recognition.onerror = (e) => {
          console.warn('SpeechRecognition notice:', e.error);
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            const browser = getBrowserDetails();
            const guidance = getPermissionGuidance(browser);
            setIsPermissionBlocked(true);
            setPermissionState('denied');
            setPermissionDetails({
              state: 'denied',
              isBlocked: true,
              title: guidance.title,
              message: guidance.message,
              browserLabel: browser.label,
              steps: guidance.steps,
            });
            setPermissionError(`${guidance.title}. ${guidance.steps[0]}`);
          }
        };

        recognition.onend = () => {
          if (transcriptRef.current.trim().length > 2) {
            triggerSubmit(transcriptRef.current);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (speechErr) {
      console.warn('Web Speech API not available or restricted, relying on audio recording:', speechErr);
    }
  }, [langCodeBcp47, silenceTimeoutMs, clearSilenceTimer, triggerSubmit]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    releaseMedia();
  }, [clearSilenceTimer, releaseMedia]);

  const stopListeningAndSubmit = useCallback(() => {
    const combined = (transcriptRef.current + ' ' + interimTranscript).trim();
    triggerSubmit(combined);
  }, [interimTranscript, triggerSubmit]);

  const resetTranscript = useCallback(() => {
    clearSilenceTimer();
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
    hasSubmittedRef.current = false;
    audioChunksRef.current = [];
  }, [clearSilenceTimer]);

  const clearError = useCallback(() => {
    setPermissionError(null);
    setPermissionDetails(null);
    setIsPermissionBlocked(false);
  }, []);

  const isSupported =
    typeof window !== 'undefined' &&
    (Boolean(navigator?.mediaDevices?.getUserMedia) ||
      Boolean(window.SpeechRecognition) ||
      Boolean(window.webkitSpeechRecognition));

  return {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    startListening,
    stopListening,
    stopListeningAndSubmit,
    resetTranscript,
    isSupported,
    permissionError,
    permissionState,
    permissionDetails,
    isPermissionBlocked,
    clearError,
    requestPermissionAndStart: startListening,
    audioLevel,
  };
}
