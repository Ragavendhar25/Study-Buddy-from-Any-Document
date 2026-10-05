import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Sparkles, 
  Lightbulb, 
  Copy, 
  Check,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, DocumentContext, StudyPack } from '../types';
import { SlingButton } from './react-bits/SlingButton';

interface ChatTabProps {
  documentContext: DocumentContext;
  studyPack: StudyPack;
  onEarnXP?: (amount: number, reason: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ documentContext, studyPack, onEarnXP }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `👋 Hey there! I'm your **Study Buddy** for **"${studyPack.title || 'this document'}"**.\n\nYou can ask me anything about the content: clarify confusing terms, ask for real-world examples, request more practice questions, or test your understanding! What would you like to explore?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [studyPack.title, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (onEarnXP) {
      onEarnXP(15, 'Asked AI Tutor');
    }

    try {
      const response = await fetch('/api/study/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContext: {
            type: documentContext.type,
            content: documentContext.content,
            title: studyPack.title || documentContext.title,
            summary: studyPack.summary,
          },
          messages: messages.map((m) => ({ role: m.role, text: m.text })),
          question,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to get answer.');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: resData.reply || 'Here is what I found in the document.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `⚠️ *Error:* ${err.message || 'Could not connect to Study Buddy. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: `Conversation cleared. What else can I help you study from **${studyPack.title || 'the notes'}**?`,
        timestamp: new Date(),
      },
    ]);
  };

  const suggestedPrompts = [
    'Explain the most challenging concept in simple terms',
    'Give me a memorable real-world analogy for this topic',
    'What are 3 typical exam traps or misconceptions?',
    'Give me an application problem with step-by-step solution',
  ];

  // Simple Markdown renderer for chat messages
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-base text-slate-900 dark:text-white mt-2 mb-1">
            {line.slice(4)}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm leading-relaxed my-0.5">
            {formattedLine.slice(1)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-sm leading-relaxed my-0.5">
            {formattedLine}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm leading-relaxed my-1">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[680px] rounded-3xl bg-white/95 dark:bg-[#110d29]/95 border-2 border-indigo-200/80 dark:border-indigo-800/60 shadow-xl overflow-hidden animate-fadeIn backdrop-blur-xl">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-[#18133a] dark:via-[#1e1747] dark:to-[#18133a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Study Buddy Chat
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                +15 XP / Question
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs sm:max-w-md font-medium">
              Grounded in {studyPack.title || 'your uploaded document'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-slate-400 transition-colors text-xs flex items-center gap-1.5 font-bold"
          title="Clear chat history"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm'
                    : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                <div
                  className={`p-4 rounded-2xl ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20 font-medium'
                      : 'bg-slate-100/90 dark:bg-[#1a143f]/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-indigo-800/50 shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>
                  ) : (
                    renderMessageContent(msg.text)
                  )}
                </div>

                {!isUser && msg.id !== 'welcome' && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100/90 dark:bg-[#1a143f]/90 border border-slate-200/80 dark:border-indigo-800/50 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2 shadow-sm">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="text-xs font-semibold ml-1">Study Buddy is synthesizing answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 4 && (
        <div className="p-3 px-4 bg-slate-50/80 dark:bg-[#151034]/90 border-t border-indigo-100/60 dark:border-indigo-900/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Try:
          </span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#1f184e] border border-indigo-200/70 dark:border-indigo-700/60 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 flex-shrink-0 transition-colors shadow-2xs font-semibold"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form with React Bits SlingButton! */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-indigo-100 dark:border-indigo-900/70 bg-white dark:bg-[#130e31] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about "${studyPack.title || 'this document'}"... (press Enter or Sling)`}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-[#1c1644] border-2 border-indigo-100 dark:border-indigo-900/80 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none transition-colors font-medium"
        />

        {/* Tactile SlingButton from React Bits */}
        <div className="flex-shrink-0 flex items-center" title="Tap to send, or drag back and release like a slingshot!">
          <SlingButton
            onSend={() => handleSend()}
            disabled={!input.trim() || loading}
            size={48}
            padColor="#6366f1"
            iconColor="#ffffff"
            accentColor="#ec4899"
            wellColor="#18133a"
            bandColor="#818cf8"
            flight={110}
            particles={12}
            spread={55}
            tapSends={true}
          />
        </div>
      </form>
    </div>
  );
};
