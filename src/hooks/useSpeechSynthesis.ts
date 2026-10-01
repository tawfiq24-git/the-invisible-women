import { useState, useEffect, useCallback } from 'react';
import { TTSService, VoiceCheckResult } from '../services/ttsService';

export interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  voiceCheck: VoiceCheckResult;
  speak: (text: string) => Promise<boolean>;
  stop: () => void;
  error: string | null;
  clearError: () => void;
}

export function useSpeechSynthesis(bcp47Lang: string, langCode?: string): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceCheck, setVoiceCheck] = useState<VoiceCheckResult>({
    hasCompatibleVoice: true,
    langTag: bcp47Lang,
    isAiVoiceAvailable: true
  });

  useEffect(() => {
    TTSService.init();
    const result = TTSService.checkVoiceAvailability(bcp47Lang);
    setVoiceCheck(result);

    // Stop speaking if language changes
    TTSService.stop();
    setIsSpeaking(false);
    setError(null);
  }, [bcp47Lang]);

  const speak = useCallback(async (text: string): Promise<boolean> => {
    setError(null);
    setIsSpeaking(true);
    const success = await TTSService.speak(
      text,
      bcp47Lang,
      langCode,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (err) => {
        setIsSpeaking(false);
        setError(err);
      }
    );
    if (!success) {
      setIsSpeaking(false);
    }
    return success;
  }, [bcp47Lang, langCode]);

  const stop = useCallback(() => {
    TTSService.stop();
    setIsSpeaking(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSpeaking,
    voiceCheck,
    speak,
    stop,
    error,
    clearError
  };
}
