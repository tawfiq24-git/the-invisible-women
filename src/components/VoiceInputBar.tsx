import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Keyboard, AlertCircle, Lock, RotateCcw, ChevronRight } from 'lucide-react';
import { getTranslation } from '../data/translations';
import { MicPermissionDetails } from '../hooks/useSpeechRecognition';

interface VoiceInputBarProps {
  selectedLanguage: string;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopListeningAndSubmit?: () => void;
  onTranscriptChange: (text: string) => void;
  onSubmit: (query: string) => void;
  isProcessing: boolean;
  permissionError: string | null;
  permissionDetails?: MicPermissionDetails | null;
  isPermissionBlocked?: boolean;
  onClearError: () => void;
  onRequestPermission?: () => void;
  isVoiceSupported: boolean;
  audioLevel?: number;
  onOpenTranscribe?: () => void;
  onOpenLiveVoice?: () => void;
}

export function VoiceInputBar({
  selectedLanguage,
  isListening,
  transcript,
  interimTranscript,
  onStartListening,
  onStopListening,
  onStopListeningAndSubmit,
  onTranscriptChange,
  onSubmit,
  isProcessing,
  permissionError,
  permissionDetails,
  isPermissionBlocked = false,
  onClearError,
  onRequestPermission,
  isVoiceSupported,
  audioLevel = 0,
  onOpenTranscribe,
  onOpenLiveVoice,
}: VoiceInputBarProps) {
  const t = getTranslation(selectedLanguage);
  const [showTextInput, setShowTextInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showTextInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [showTextInput]);

  const handleMicClick = () => {
    if (isListening) {
      if (onStopListeningAndSubmit && (transcript.trim() || interimTranscript.trim())) {
        onStopListeningAndSubmit();
      } else {
        onStopListening();
      }
    } else {
      if (onRequestPermission) {
        onRequestPermission();
      } else {
        onStartListening();
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onSubmit(manualText.trim());
      setManualText('');
    }
  };

  const handleTranscriptSubmit = () => {
    const fullText = (transcript + ' ' + interimTranscript).trim();
    if (fullText) {
      onSubmit(fullText);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-1.5 sm:py-3">
      {/* Permission or system error alert */}
      {(permissionDetails?.isBlocked || isPermissionBlocked || permissionError) && (
        <div className="mb-3 sm:mb-4 p-3.5 sm:p-4 rounded-3xl bg-amber-50/95 border-2 border-amber-300 text-stone-900 text-xs sm:text-sm shadow-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Lock className="w-5 h-5 text-amber-800" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">
                  {permissionDetails?.title || 'Microphone Access Required'}
                </h4>
                {permissionDetails?.browserLabel && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 shrink-0">
                    {permissionDetails.browserLabel}
                  </span>
                )}
              </div>

              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-3">
                {permissionDetails?.message || permissionError || 'Please allow microphone access to talk with AWAAZ.'}
              </p>

              {/* Numbered Step-by-Step Guidance */}
              {permissionDetails?.steps && permissionDetails.steps.length > 0 && (
                <div className="space-y-1.5 mb-3.5 bg-white/80 p-3 rounded-2xl border border-amber-200/80">
                  <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-1">
                    How to enable microphone in 10 seconds:
                  </span>
                  {permissionDetails.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-800 text-xs sm:text-sm font-medium leading-snug">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {onRequestPermission && (
                  <button
                    type="button"
                    onClick={onRequestPermission}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again / Check Access</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClearError();
                    setShowTextInput(true);
                  }}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Keyboard className="w-3.5 h-3.5 text-stone-600" />
                  <span>Type with Keyboard</span>
                </button>

                <button
                  type="button"
                  onClick={onClearError}
                  className="min-h-[40px] px-3 py-2 text-stone-500 hover:text-stone-800 font-semibold text-xs ml-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Voice Transcript Box (Visible when speaking or text is present) */}
      {(isListening || transcript || interimTranscript) && !showTextInput && (
        <div className="mb-4 p-4 rounded-3xl bg-white border-2 border-rose-300 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {isListening && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? 'bg-rose-500' : 'bg-stone-400'}`}></span>
              </span>
              <span className="text-xs font-bold text-rose-800">
                {isListening ? t.micListening : 'Review your words'}
              </span>
            </div>

            <span className="text-[11px] text-stone-400">
              Tap text to edit if needed
            </span>
          </div>

          <textarea
            value={transcript + (interimTranscript ? ' ' + interimTranscript : '')}
            onChange={(e) => onTranscriptChange(e.target.value)}
            rows={2}
            className="w-full p-2 text-base sm:text-lg font-semibold text-stone-900 bg-stone-50/50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 resize-none"
            placeholder={t.micListening}
          />

          <div className="mt-3 flex items-center justify-end gap-2">
            {isListening && (
              <button
                type="button"
                onClick={onStopListening}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95"
              >
                {t.micStopListening}
              </button>
            )}

            <button
              type="button"
              disabled={isProcessing || (!transcript.trim() && !interimTranscript.trim())}
              onClick={handleTranscriptSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-sm bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{t.askButton}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Microphone Interaction Pod */}
      <div className="flex flex-col items-center justify-center">
        {!showTextInput ? (
          <div className="flex flex-col items-center">
            {/* The Big Pulsing Microphone Button */}
            <div className="relative group">
              {/* Outer pulsing acoustic ring */}
              {isListening && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                  <div className="absolute -inset-6 rounded-full bg-rose-500/10 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                type="button"
                onClick={handleMicClick}
                disabled={isProcessing}
                aria-label={isListening ? t.micStopListening : t.micTapToSpeak}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 active:scale-90 ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-600 to-rose-600 ring-8 ring-rose-200 shadow-rose-500/50 scale-105'
                    : 'bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-rose-600/30 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
                ) : (
                  <Mic className="w-9 h-9 sm:w-11 sm:h-11" />
                )}
              </button>
            </div>

            {/* Instruction label under button */}
            <div className="mt-3.5 text-center flex flex-col items-center">
              {/* Live Audio Waveform */}
              {isListening && (
                <div className="flex items-center gap-1 mb-2 h-8">
                  {[0.5, 0.9, 1.2, 0.8, 1.1, 0.6, 0.9, 0.4].map((mult, idx) => {
                    const barHeight = Math.max(6, Math.min(30, (audioLevel * 45 * mult) + 8));
                    return (
                      <div
                        key={idx}
                        className="w-1.5 rounded-full bg-gradient-to-t from-rose-600 to-amber-500 transition-all duration-75"
                        style={{ height: `${barHeight}px` }}
                      />
                    );
                  })}
                </div>
              )}

              <span className="text-sm sm:text-base font-bold text-stone-800 block">
                {isListening ? t.micListening : t.micTapToSpeak}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {isListening ? 'Speak freely • Answers automatically when you pause' : 'Zero typing needed • Speak freely in your language'}
              </span>
            </div>

            {/* Alternative interaction options */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              {onOpenLiveVoice && (
                <button
                  type="button"
                  onClick={onOpenLiveVoice}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full active:scale-95 transition-all shadow-2xs"
                  title="Real-Time Voice Call with gemini-3.8-live"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>Live Call (gemini-3.8-live)</span>
                </button>
              )}

              {onOpenTranscribe && (
                <button
                  type="button"
                  onClick={onOpenTranscribe}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full active:scale-95 transition-all shadow-2xs"
                  title="Audio Transcription with gemini-3.5-transcribe"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transcribe (gemini-3.5-transcribe)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowTextInput(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:underline px-3 py-1.5 rounded-full hover:bg-stone-200/50 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5 text-stone-400" />
                <span>Type with keyboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* Manual Typing Mode */
          <div className="w-full bg-white rounded-3xl p-2 sm:p-3 shadow-lg border border-stone-200 animate-fade-in">
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
              <input
                ref={textInputRef}
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={t.typePlaceholder}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-base font-medium text-stone-900 bg-transparent focus:outline-hidden"
              />

              <button
                type="submit"
                disabled={!manualText.trim() || isProcessing}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white disabled:opacity-40 transition-all"
                aria-label="Send query"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs px-2 text-stone-500">
              <span>Prefer speaking?</span>
              <button
                type="button"
                onClick={() => {
                  setShowTextInput(false);
                  if (isVoiceSupported) {
                    onStartListening();
                  }
                }}
                className="font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Mic className="w-3.5 h-3.5" />
                Switch to Voice Microphone
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
