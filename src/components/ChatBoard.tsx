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
  ExternalLink,
  Activity,
  CheckCircle2,
  Wrench,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'tripmate_ai' | 'static_fallback';
  n8nNote?: string;
  error?: boolean;
}

const N8N_WEBHOOK_URL =
  'https://pottipooja007.app.n8n.cloud/webhook/880509cf-1566-4ff8-b9fc-e3474d78da39/chat';
const N8N_INSTANCE_ID =
  '0405ba39bf2aca1aa1f124004ac64ec053424c6558ae320531ea7df30c22c4c0';

// Generate standard UUID for n8n session compliance
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const ChatBoard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [showGreetingPrompt, setShowGreetingPrompt] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [testingHealth, setTestingHealth] = useState(false);

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
        text: '👋 Hello! I am your **TripMate Travel Assistant**, linked to your n8n workflow.\n\nI can help you coordinate flights, trains, and buses from **Srikakulam to Goa**, compare beachfront resorts in Candolim, plan day-by-day itineraries, or find top seafood shacks. What can I plan for you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'n8n',
      },
    ];
  });

  useEffect(() => {
    let sid = localStorage.getItem('tripmate_chat_session_id');
    if (!sid || !sid.includes('-')) {
      sid = generateUUID();
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

  const runDiagnosticCheck = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch('/api/n8n-status');
      const data = await res.json();
      setDiagnosticResult(data);
    } catch (err: any) {
      setDiagnosticResult({
        online: false,
        error: err.message,
      });
    } finally {
      setTestingHealth(false);
    }
  };

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
      // Call the server chat endpoint which coordinates with n8n and uses smart fallback if needed
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: textToSend,
          sessionId: sessionId || generateUUID(),
          history: messages.slice(-5),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.output || "I've checked your trip details. How else can I assist?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || (data.n8nWorkflowError ? 'tripmate_ai' : 'n8n'),
        n8nNote: data.n8nNote,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      // Even if network completely failed, provide a helpful answer
      const botMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `Here is information regarding your query: "${textToSend}".\n\nFor a trip from **Srikakulam to Goa**, you can take the morning flight from nearby Visakhapatnam (VTZ) taking ~5h 20m, or the scenic Amaravathi Express train. Stays in Candolim and Ashvem offer easy beach access and local dining.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'static_fallback',
        n8nNote: 'Network error communicating with server endpoint.',
      };
      setMessages((prev) => [...prev, botMsg]);
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
      source: 'n8n',
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
    '👥 Best vacation with friends',
    '✈️ Flights & trains from Srikakulam to Goa',
    '🏖️ Top 3 beaches for sunsets & shacks',
    '🏨 Recommend luxury beachfront resorts in Candolim',
    '📅 Can you make a 5-day itinerary for friends?',
    '🍛 What are the must-try Goan seafood dishes?',
  ];

  // Helper to format text with bold, lists, and code blocks
  const renderFormattedText = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <div key={pIdx} className="mb-2 last:mb-0 space-y-1">
          {lines.map((line, lIdx) => {
            let content: React.ReactNode = line;

            // Handle bullet points
            const isBullet =
              line.trim().startsWith('- ') ||
              line.trim().startsWith('* ') ||
              line.trim().startsWith('• ');
            const cleanedLine = isBullet ? line.trim().replace(/^[-*•]\s+/, '') : line;

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
                  <code
                    key={partIdx}
                    className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px] text-teal-800"
                  >
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
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[620px] max-h-[88vh]'
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
                  <button
                    onClick={() => {
                      setShowDiagnostic(!showDiagnostic);
                      if (!diagnosticResult) runDiagnosticCheck();
                    }}
                    className="text-[10px] bg-teal-900/80 hover:bg-teal-800 text-teal-300 font-mono px-1.5 py-0.2 rounded border border-teal-700/50 flex items-center gap-1 transition-colors"
                    title="Click to inspect n8n webhook status"
                  >
                    <Activity className="w-2.5 h-2.5" />
                    <span>n8n Status</span>
                  </button>
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

          {/* DIAGNOSTIC EXPANDABLE DRAWER */}
          {showDiagnostic && (
            <div className="bg-slate-800 text-slate-200 p-3.5 border-b border-slate-700 text-xs shrink-0 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Wrench className="w-3.5 h-3.5 text-teal-400" />
                  <span>n8n Webhook Diagnostics</span>
                </div>
                <button
                  onClick={runDiagnosticCheck}
                  disabled={testingHealth}
                  className="px-2 py-0.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded text-[10px] font-semibold"
                >
                  {testingHealth ? 'Testing...' : 'Test Connection'}
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <span className="text-slate-400">Target Webhook:</span>{' '}
                  <code className="text-teal-300 font-mono text-[10px] break-all">
                    {N8N_WEBHOOK_URL}
                  </code>
                </div>

                {diagnosticResult && (
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 mt-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          diagnosticResult.online ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-semibold text-white">
                        {diagnosticResult.online
                          ? 'Webhook Reached & Online (HTTP 200)'
                          : 'Webhook Offline or Blocked'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      {diagnosticResult.message || 'Responding to requests.'}
                    </p>
                  </div>
                )}

                <div className="pt-2 text-[10px] text-slate-400">
                  💡 <strong>n8n Troubleshooting Tip:</strong> If your n8n workflow returns{' '}
                  <code className="text-amber-300 font-mono">Error in workflow</code>, open your{' '}
                  <a
                    href="https://pottipooja007.app.n8n.cloud"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 underline inline-flex items-center gap-0.5"
                  >
                    n8n Executions tab <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  to check if the AI Agent / model credentials (e.g. OpenAI or Gemini key) need to be configured. TripMate seamlessly provides smart travel answers in the meantime!
                </div>
              </div>
            </div>
          )}

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
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs shadow-xs relative ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div>
                        {/* Notice badge if n8n returned workflow error */}
                        {msg.n8nNote && msg.n8nNote.includes('Error in workflow') && (
                          <div className="mb-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-center justify-between gap-1">
                            <span className="flex items-center gap-1 font-semibold">
                              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>n8n workflow reported internal error</span>
                            </span>
                            <button
                              onClick={() => setShowDiagnostic(true)}
                              className="text-teal-700 underline font-semibold shrink-0"
                            >
                              Details
                            </button>
                          </div>
                        )}

                        <div className="text-slate-800">{renderFormattedText(msg.text)}</div>
                      </div>
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
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {msg.source === 'n8n' ? 'n8n Cloud' : 'TripMate AI'}
                        </span>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-600 flex items-center gap-1 ml-1"
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
                      </>
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
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    TripMate AI is analyzing your trip...
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
                placeholder="Ask about flights, hotels, or Srikakulam → Goa..."
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
            <button
              onClick={() => {
                setShowDiagnostic(!showDiagnostic);
                if (!diagnosticResult) runDiagnosticCheck();
              }}
              className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0 ml-2 hover:underline"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Connected · Inspect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
