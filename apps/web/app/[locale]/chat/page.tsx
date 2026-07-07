'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function ChatPage() {
  const { conversationId, setConversationId, accessToken } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: historyData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/chat/conversations/${conversationId}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader');

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true }]);

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
              setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, isStreaming: false } : m));
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'token') {
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, content: m.content + parsed.data } 
                      : m
                  )
                );
              } else if (parsed.type === 'done') {
                setIsTyping(false);
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, isStreaming: false } : m));
                if (parsed.data.conversationId && parsed.data.conversationId !== conversationId) {
                  setConversationId(parsed.data.conversationId);
                }
              }
            } catch {
              console.error('Failed to parse SSE line:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
            <Bot className="w-16 h-16" />
            <p className="text-xl font-medium">How can I help you with Government Services today?</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted text-foreground border border-border rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && !messages.find(m => m.isStreaming) && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-muted border border-border rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t border-border">
        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about schemes, filing complaints, etc..."
            className="w-full bg-muted border border-border rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isTyping && !messages.find(m => m.isStreaming)}
          />
          <button
            type="submit"
            disabled={!input.trim() || (isTyping && !messages.find(m => m.isStreaming))}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Smart Bharat AI can make mistakes. Verify important information on official portals.
        </p>
      </div>
    </div>
  );
}
