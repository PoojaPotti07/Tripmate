import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Compass,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  error?: boolean;
}

const N8N_WEBHOOK_URL =
  'https://pottipooja007.app.n8n.cloud/webhook/880509cf-1566-4ff8-b9fc-e3474d78da39/chat';

export const ChatBoard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [showGreetingPrompt, setShowGreetingPrompt] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or restore session ID and messages from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('tripmate_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: '👋 Hello! I am your **TripMate AI Travel Assistant**, powered by your n8n workflow.\n\nI can help you plan your journey from **Srikakulam to Goa**, compare flights, trains, and buses, suggest luxury beach resorts, recommend hidden tourist spots, or calculate your trip budget. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  useEffect(() => {
    let sid = localStorage.getItem('tripmate_chat_session_id');
    if (!sid) {
      sid = `tripmate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('tripmate_chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tripmate_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    setShowGreetingPrompt(false);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // First attempt direct call to n8n Cloud Webhook
      let responseText = '';
      const payload = {
        chatInput: textToSend,
        action: 'sendMessage',
        sessionId: sessionId || 'default-session',
      };

      try {
        const res = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          responseText =
            data.output ||
            data.text ||
            data.message ||
            (Array.isArray(data) && data[0]?.json?.output) ||
            (typeof data === 'string' ? data : JSON.stringify(data));
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (directErr) {
        // Fallback to local server proxy in case of browser network/CORS restrictions
        console.warn('Direct n8n webhook request had an issue, trying proxy...', directErr);
        const proxyRes = await fetch('/api/n8n-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (proxyRes.ok) {
          const data = await proxyRes.json();
          responseText =
            data.output ||
            data.text ||
            data.message ||
            (Array.isArray(data) && data[0]?.json?.output) ||
            (typeof data === 'string' ? data : JSON.stringify(data));
        } else {
          throw new Error('Both direct and proxy connection attempts failed');
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText || "I've processed your request. How else can I assist with your trip?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error communicating with n8n chatbot:', error);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ I had difficulty connecting to the n8n assistant endpoint at \`${N8N_WEBHOOK_URL}\`. Please verify your n8n workflow is active, or try again in a few moments.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: 'Chat history cleared. What would you like to plan next for your trip?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    try {
      localStorage.removeItem('tripmate_chat_history');
    } catch {}
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    '✈️ Flights & trains from Srikakulam to Goa',
    '🏖️ Top 3 beaches for sunsets & shacks',
    '🏨 Recommend luxury beachfront resorts in Candolim',
    '📅 Can you make a 5-day itinerary for 2 adults?',
    '🍛 What are the must-try Goan seafood dishes?',
  ];

  // Helper to format basic markdown-style text
  const renderFormattedText = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <div key={pIdx} className="mb-2 last:mb-0 space-y-1">
          {lines.map((line, lIdx) => {
            let content: React.ReactNode = line;

            // Handle bullet points
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const cleanedLine = isBullet ? line.trim().substring(2) : line;

            // Bold parsing: **bold**
            const parts = cleanedLine.split(/(\*\*.*?\*\*)/g);
            content = parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-bold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              // Code formatting: `code`
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code key={partIdx} className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px] text-teal-800">
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return part;
            });

            if (isBullet) {
              return (
                <div key={lIdx} className="flex items-start gap-1.5 pl-2 text-xs">
                  <span className="text-teal-600 font-bold shrink-0">•</span>
                  <span>{content}</span>
                </div>
              );
            }

            return (
              <p key={lIdx} className="text-xs leading-relaxed">
                {content}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="no-print">
      {/* FLOATING ACTION TRIGGER BUBBLE (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          {/* Greeting Prompt Tooltip */}
          {showGreetingPrompt && (
            <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 text-xs font-semibold animate-in fade-in slide-in-from-right duration-300">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Ask TripMate AI Assistant</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreetingPrompt(false);
                }}
                className="text-slate-400 hover:text-slate-600 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Floating Trigger Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowGreetingPrompt(false);
            }}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-teal-600 text-white shadow-xl hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-500/30"
            title="Open TripMate AI Assistant"
            aria-label="Open AI Chatboard"
          >
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />

            {/* Active Live Pulse Indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </button>
        </div>
      )}

      {/* FLOATING CHATBOARD WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl rounded-3xl border border-slate-200 bg-white flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* CHAT HEADER */}
          <div className="bg-slate-900 text-white px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">TripMate AI Assistant</h3>
                  <span className="text-[10px] bg-teal-900/80 text-teal-300 font-mono px-1.5 py-0.2 rounded border border-teal-700/50">
                    n8n Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Live Travel Concierge & Trip Planner</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Maximize Window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/70">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-xs relative ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : msg.error
                        ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="text-slate-800">{renderFormattedText(msg.text)}</div>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div
                    className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 ${
                      isUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-600 flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Typing / Thinking Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    TripMate AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" /> Suggestions:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200 rounded-full transition-all shrink-0 whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything about tickets, hotels, or Goa..."
                disabled={isLoading}
                className="w-full pl-3.5 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder-slate-400 disabled:opacity-50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* FOOTER WEBHOOK STATUS */}
          <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate">Webhook: .../webhook/880509cf-1566-4ff8-b9fc-e3474d78da39/chat</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1 shrink-0 ml-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Connected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
