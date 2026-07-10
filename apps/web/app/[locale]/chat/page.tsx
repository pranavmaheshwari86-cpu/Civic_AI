'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  'How do I renew my Aadhaar card?',
  'Find scholarships for SC/ST students',
  'How to report a pothole in my area?',
  'Check PM Kisan eligibility criteria',
  'Steps to apply for a passport',
  'What documents are needed for a ration card?',
];

export default function ChatPage() {
  const { conversationId, setConversationId, accessToken } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const { data: historyData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/chat/conversations/${conversationId}`,
        { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
      );
      if (!res.ok) throw new Error('Failed to load conversation history');
      return res.json() as Promise<{ messages: Array<{ role: 'user' | 'assistant'; content: string }> }>;
    },
    enabled: !!conversationId,
    retry: false,
  });

  useEffect(() => {
    if (historyData?.messages) {
      setMessages(
        historyData.messages.map((m, index) => ({
          id: `history-${index}`,
          role: m.role,
          content: m.content,
        }))
      );
    }
  }, [historyData]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const doSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ message: trimmed, conversationId }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsTyping(false);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                )
              );
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'token') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: m.content + parsed.data }
                      : m
                  )
                );
              } else if (parsed.type === 'done') {
                setIsTyping(false);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                  )
                );
                if (
                  parsed.data.conversationId &&
                  parsed.data.conversationId !== conversationId
                ) {
                  setConversationId(parsed.data.conversationId);
                }
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME composition guard — do not submit during CJK composition
    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend(input);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
    // Immediately send on prompt click
    doSend(prompt);
  };

  const isInputDisabled = isTyping && !messages.find((m) => m.isStreaming);

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      {/* sr-only live region for screen readers */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
      >
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].isStreaming
          ? messages[messages.length - 1].content
          : ''}
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-6"
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 py-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  How can I help you today?
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Ask anything about government schemes, document requirements, civic complaints, or services.
                </p>
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="w-full max-w-xl" aria-label="Suggested questions">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Try asking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1"
                aria-hidden="true"
              >
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted text-foreground border border-border rounded-tl-sm'
              }`}
              aria-label={msg.role === 'user' ? 'You said' : 'CivicAI said'}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.isStreaming && (
                <span
                  className="inline-block w-2 h-4 ml-1 bg-primary/60 animate-pulse rounded-sm"
                  aria-hidden="true"
                />
              )}
            </div>

            {msg.role === 'user' && (
              <div
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1"
                aria-hidden="true"
              >
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isTyping && !messages.find((m) => m.isStreaming) && (
          <div className="flex gap-3 justify-start">
            <div
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1"
              aria-hidden="true"
            >
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl bg-muted border border-border rounded-tl-sm flex items-center gap-2"
              aria-label="CivicAI is thinking"
            >
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area — pinned to bottom, safe-area aware */}
      <div
        className="shrink-0 p-4 bg-background border-t border-border"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <form onSubmit={sendMessage} className="relative" role="search" aria-label="Send a message">
          <label htmlFor="chat-input" className="sr-only">
            Ask about government services
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about schemes, filing complaints, services..."
            className="w-full bg-muted border border-border rounded-full py-3.5 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isInputDisabled}
            autoComplete="off"
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isInputDisabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2.5 leading-relaxed">
          CivicAI can make mistakes. Always verify important information on official government portals.
        </p>
      </div>
    </div>
  );
}
