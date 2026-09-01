import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Send,
  Paperclip,
  Copy,
  Check,
  Bot,
  Sparkles,
  Search,
  MessageSquare,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendChatMessage,
    startNewConversation,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchConv, setSearchConv] = useState('');

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchConv.toLowerCase())
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-background text-on-background font-body-md animate-in fade-in duration-200">
      {/* Left Conversations Sidebar (Matching Screenshot 4) */}
      <aside className="w-80 md:w-88 border-r border-outline-variant/70 dark:border-outline-variant/40 bg-surface-container-lowest dark:bg-surface-container-low flex flex-col shrink-0">
        {/* Header & New Chat Button */}
        <div className="p-4 border-b border-outline-variant/60 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-base font-bold text-on-surface flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary dark:text-primary-fixed" />
              Tuteur EduBot IA
            </h2>
            <button
              id="btn-new-conversation"
              onClick={() => startNewConversation('Nouvelle discussion')}
              className="p-1.5 rounded-lg bg-primary/10 text-primary dark:text-primary-fixed hover:bg-primary/20 transition-colors"
              title="Nouvelle conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full h-8 pl-8 pr-3 bg-surface dark:bg-surface-container rounded-lg border border-outline-variant/60 text-xs text-on-surface focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 ${
                  isActive
                    ? 'bg-surface-container-low dark:bg-surface-container border-l-4 border-primary dark:border-primary-fixed shadow-2xs'
                    : 'hover:bg-surface-container border-l-4 border-transparent text-on-surface-variant'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span
                    className={`font-title-md text-xs truncate ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed font-bold'
                        : 'text-on-surface font-semibold'
                    }`}
                  >
                    {conv.title}
                  </span>
                  <span className="text-[10px] text-outline shrink-0">{conv.timestamp}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                  {conv.preview}
                </p>
                {conv.category && (
                  <span className="self-start text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-surface-container-highest/60 text-outline mt-1">
                    {conv.category}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Main Chat Area (Exact match of Screenshot 4) */}
      <main className="flex-1 flex flex-col bg-surface/40 dark:bg-surface-dim/20 relative overflow-hidden">
        {/* Chat Header */}
        <div className="h-14 px-6 border-b border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-container-low flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-title-md text-sm font-bold text-on-surface">{activeConv.title}</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                EduBot IA connecté (Gemini Pro)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-medium">{activeConv.timeLabel || 'Aujourd\'hui'}</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Time Separator */}
          <div className="flex items-center justify-center">
            <span className="text-[11px] font-semibold text-outline bg-surface-container-lowest dark:bg-surface-container px-3 py-1 rounded-full border border-outline-variant/50">
              Aujourd'hui
            </span>
          </div>

          {activeConv.messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`flex flex-col gap-2 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-primary dark:bg-primary-container text-on-primary rounded-tr-xs'
                    : 'bg-surface-container-lowest dark:bg-surface-container text-on-surface border border-outline-variant/60 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Code Snippet block if present (Matching Screenshot 4) */}
                {msg.codeSnippet && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 bg-[#0f172a] text-slate-100 text-xs font-mono">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>{msg.codeSnippet.language.toUpperCase()}</span>
                      <button
                        onClick={() => handleCopyCode(msg.codeSnippet!.code, idx)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copié
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copier
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3.5 overflow-x-auto text-[12px] leading-relaxed text-emerald-300">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Highlight Note */}
                {msg.note && (
                  <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                    {msg.note}
                  </p>
                )}

                {/* Timestamp */}
                <span
                  className={`text-[10px] self-end mt-1 ${
                    msg.sender === 'user' ? 'text-primary-fixed-dim' : 'text-outline'
                  }`}
                >
                  {msg.timestamp}
                </span>

                {/* Suggestions Chips (Matching Screenshot 4) */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-outline-variant/40 flex flex-wrap gap-2">
                    {msg.suggestions.map((sugg, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => sendChatMessage(sugg)}
                        className="text-xs bg-surface-container dark:bg-surface-container-high text-primary dark:text-primary-fixed hover:bg-surface-container-highest border border-outline-variant/50 px-3 py-1.5 rounded-full transition-colors text-left"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar (Matching Screenshot 4) */}
        <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/60 shrink-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-2 bg-surface dark:bg-surface-container p-2 rounded-2xl border border-outline-variant/70 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            <button
              type="button"
              className="p-2 text-outline hover:text-on-surface rounded-lg transition-colors"
              title="Joindre un fichier ou un code source"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Posez votre question à l'EduBot..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 text-xs sm:text-sm text-on-surface placeholder:text-outline max-h-32"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-primary dark:bg-primary-container text-on-primary hover:bg-primary-container transition-all disabled:opacity-40 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
