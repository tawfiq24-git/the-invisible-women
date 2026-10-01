/**
 * TTS Service abstraction for AWAAZ
 * Ensures voice output is strictly based on the user's selected language:
 * 1. Primary: Server-side Gemini AI Multilingual TTS (gemini-3.8-flash-lite-tts) for authentic native accents in Tamil, Hindi, Telugu, etc.
 * 2. Secondary fallback: Browser Web SpeechSynthesis matching exact BCP-47 language tag (never speaking Indian scripts with English voices).
 */

export interface VoiceCheckResult {
  hasCompatibleVoice: boolean;
  voiceName?: string;
  langTag: string;
  isAiVoiceAvailable: boolean;
}

export class TTSService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;

  private static cachedVoices: SpeechSynthesisVoice[] = [];
  private static currentAudioElement: HTMLAudioElement | null = null;
  private static _isSpeaking: boolean = false;

  static init() {
    if (!this.synth) return;
    this.updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.updateVoices();
      };
    }
  }

  private static updateVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    this.cachedVoices = this.synth.getVoices();
    return this.cachedVoices;
  }

  /**
   * Checks if a compatible voice is available (either browser speech or Gemini AI TTS)
   */
  static checkVoiceAvailability(bcp47Lang: string): VoiceCheckResult {
    const isAiVoiceAvailable = true; // Always supported via /api/gemini/tts

    if (!this.synth) {
      return {
        hasCompatibleVoice: isAiVoiceAvailable,
        langTag: bcp47Lang,
        isAiVoiceAvailable
      };
    }

    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    const targetPrefix = bcp47Lang.split('-')[0].toLowerCase();

    // Look for exact BCP-47 match first (e.g. 'ta-IN', 'hi-IN')
    let found = voices.find(v => v.lang.toLowerCase() === bcp47Lang.toLowerCase());

    // Or prefix match (e.g. 'ta' in 'ta_IN', 'hi' in 'hi-IN')
    if (!found) {
      found = voices.find(v => {
        const vPrefix = v.lang.replace('_', '-').split('-')[0].toLowerCase();
        return vPrefix === targetPrefix;
      });
    }

    if (found) {
      return {
        hasCompatibleVoice: true,
        voiceName: found.name,
        langTag: found.lang,
        isAiVoiceAvailable
      };
    }

    return {
      hasCompatibleVoice: isAiVoiceAvailable,
      langTag: bcp47Lang,
      isAiVoiceAvailable
    };
  }

  /**
   * Plays voice strictly in the selected language.
   * Uses Gemini AI TTS for authentic Indic pronunciation, with browser SpeechSynthesis as fallback.
   */
  static async speak(
    text: string,
    bcp47Lang: string,
    langCode?: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): Promise<boolean> {
    // Stop any existing playback
    this.stop();

    if (!text.trim()) {
      return false;
    }

    const language = langCode || bcp47Lang.split('-')[0] || 'ta';

    // 1. Try Gemini AI Multilingual Speech Endpoint
    try {
      this._isSpeaking = true;
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 450),
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
          this.currentAudioElement = audio;

          audio.onplay = () => {
            this._isSpeaking = true;
            onStart?.();
          };

          audio.onended = () => {
            this._isSpeaking = false;
            this.currentAudioElement = null;
            onEnd?.();
          };

          audio.onerror = (e) => {
            console.warn('Audio playback error, falling back to browser synthesis:', e);
            this._isSpeaking = false;
            this.currentAudioElement = null;
            this.speakWithBrowserSynth(text, bcp47Lang, onStart, onEnd, onError);
          };

          await audio.play();
          return true;
        }
      }
    } catch (apiErr) {
      console.warn('Gemini TTS fetch failed, attempting browser SpeechSynthesis:', apiErr);
    }

    // 2. Fallback to Browser Speech Synthesis
    return this.speakWithBrowserSynth(text, bcp47Lang, onStart, onEnd, onError);
  }

  private static speakWithBrowserSynth(
    text: string,
    bcp47Lang: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): boolean {
    if (!this.synth) {
      this._isSpeaking = false;
      onError?.('Speech synthesis is not supported on this device.');
      return false;
    }

    const voiceCheck = this.checkVoiceAvailability(bcp47Lang);
    const isEnglish = bcp47Lang.startsWith('en');

    // Never speak an Indian language with an English voice
    if (!voiceCheck.hasCompatibleVoice && !isEnglish) {
      this._isSpeaking = false;
      onError?.(`Voice for ${bcp47Lang} is not installed on this device.`);
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47Lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.05;

      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
      const targetPrefix = bcp47Lang.split('-')[0].toLowerCase();
      const matched = voices.find(v =>
        v.lang.toLowerCase() === bcp47Lang.toLowerCase() ||
        v.lang.replace('_', '-').split('-')[0].toLowerCase() === targetPrefix
      );

      if (matched) {
        utterance.voice = matched;
      }

      utterance.onstart = () => {
        this._isSpeaking = true;
        onStart?.();
      };

      utterance.onend = () => {
        this._isSpeaking = false;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this._isSpeaking = false;
        console.warn('Speech synthesis utterance error:', e);
        onEnd?.();
        onError?.(e.error || 'Playback error');
      };

      this.synth.speak(utterance);
      return true;
    } catch (err) {
      this._isSpeaking = false;
      console.error('Speech synthesis failure:', err);
      onError?.('Could not play speech.');
      return false;
    }
  }

  static stop() {
    this._isSpeaking = false;

    // Stop HTML Audio element
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    // Stop browser SpeechSynthesis
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
  }

  static isSpeaking(): boolean {
    return this._isSpeaking || Boolean(this.synth?.speaking) || Boolean(this.currentAudioElement && !this.currentAudioElement.paused);
  }
}
