import { useState } from 'react';
import { Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getTranslation } from '../data/translations';

export interface FollowUpMessage {
  id: string;
  sender: 'user' | 'saheli';
  text: string;
}

interface FollowUpChatProps {
  schemeId: string;
  selectedLanguage: string;
  messages: FollowUpMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export function FollowUpChat({
  selectedLanguage,
  messages,
  onSendMessage,
  isLoading,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}: FollowUpChatProps) {
  const t = getTranslation(selectedLanguage);
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4 sm:my-6 p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-md">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 text-stone-900 font-bold text-base sm:text-lg border-b border-stone-100 pb-2.5 sm:pb-3">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
        <h3>{t.followUpTitle}</h3>
      </div>

      {/* Messages Thread */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-xs'
                    : 'bg-stone-100 text-stone-900 rounded-bl-xs border border-stone-200/60'
                }`}
              >
                {msg.text}

                {msg.sender === 'saheli' && (
                  <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                    <span>AWAAZ Sister</span>
                    <button
                      type="button"
                      onClick={() => (isSpeaking ? onStopSpeak() : onSpeak(msg.text))}
                      className="min-h-[32px] flex items-center gap-1 font-bold text-rose-700 hover:underline px-1"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl text-stone-500 text-xs font-semibold max-w-[85%]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>AWAAZ is answering your question...</span>
            </div>
          )}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.followUpPlaceholder}
          className="flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 text-base rounded-2xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white disabled:opacity-40 shadow-sm transition-all"
          aria-label={t.askFollowUpBtn}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
