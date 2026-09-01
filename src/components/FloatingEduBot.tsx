import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, X, Send, Maximize2, Sparkles } from 'lucide-react';

export const FloatingEduBot: React.FC = () => {
  const { currentView, setCurrentView, sendChatMessage, conversations, activeConversationId } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  // If already on the messages view or player view where EduBot is integrated, hide the floating trigger or keep it handy
  if (currentView === 'messages' || currentView === 'player') return null;

  const currentConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const lastAiMessage = currentConv?.messages.filter((m) => m.sender === 'ai').pop();

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleExpandToFullChat = () => {
    setIsOpen(false);
    setCurrentView('messages');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Chat Popup */}
      {isOpen && (
        <div
          id="floating-edubot-card"
          className="mb-4 w-[360px] sm:w-[400px] bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-container to-secondary p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs relative">
                <Bot className="w-4 h-4 text-white" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-tertiary-fixed rounded-full ring-2 ring-primary-container animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">EduBot IA</h3>
                <span className="text-[10px] text-primary-fixed-dim">Tuteur disponible 24/7</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleExpandToFullChat}
                title="Plein écran"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fermer"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Preview Body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[300px] text-xs bg-surface/50 dark:bg-surface-dim/30">
            {currentConv.messages.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-xs'
                      : 'bg-surface-container-lowest dark:bg-surface-container border border-outline-variant/50 text-on-surface rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Suggestions Chips */}
            {lastAiMessage?.suggestions && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {lastAiMessage.suggestions.slice(0, 2).map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendChatMessage(sugg);
                    }}
                    className="text-[11px] bg-surface-container dark:bg-surface-container-high text-primary dark:text-primary-fixed border border-outline-variant/40 px-2.5 py-1 rounded-full hover:bg-surface-container-high transition-colors text-left"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Input */}
          <form onSubmit={handleSend} className="p-3 bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/50 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Posez une question sur vos cours..."
              className="flex-1 bg-surface dark:bg-surface-container text-xs text-on-surface py-2 px-3 rounded-lg border border-outline-variant/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (Exact match of Screenshot 6 floating bot) */}
      <button
        id="floating-edubot-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir l'assistant EduBot IA"
        className="w-14 h-14 bg-gradient-to-br from-primary-container to-surface-tint rounded-full flex items-center justify-center shadow-xl relative group active:scale-95 transition-transform hover:shadow-2xl cursor-pointer"
        style={{ boxShadow: '0px 10px 20px -3px rgba(0, 6, 102, 0.35)' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-60 pointer-events-none" />
        <Bot className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-tertiary-fixed border-2 border-surface-container-lowest"></span>
        </span>
      </button>
    </div>
  );
};
