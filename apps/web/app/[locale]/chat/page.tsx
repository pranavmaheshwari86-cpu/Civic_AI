'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Send, Bot, User, Loader2, HeartPulse, FileText, GraduationCap, ShieldAlert, Paperclip, Mic, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

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
    <div className="flex flex-col h-[calc(100vh-80px)] px-6 lg:px-12 py-8 max-w-[1400px] mx-auto w-full">
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-[2rem] mb-4">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Namaste! I am Bharat AI</h1>
              <p className="text-lg text-muted-foreground">Your personal civic assistant. How can I help you today?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
              <button onClick={() => setInput('Find healthcare schemes')} className="text-left outline-none group">
                <Card className="p-6 h-full flex flex-col bg-card shadow-ambient border-0 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Healthcare</h3>
                  <p className="text-sm text-muted-foreground">Find Ayushman Bharat hospitals & claim status.</p>
                </Card>
              </button>
              
              <button onClick={() => setInput('Help with documents')} className="text-left outline-none group">
                <Card className="p-6 h-full flex flex-col bg-card shadow-ambient border-0 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Documents</h3>
                  <p className="text-sm text-muted-foreground">Sync DigiLocker & track applications.</p>
                </Card>
              </button>
              
              <button onClick={() => setInput('Education scholarships')} className="text-left outline-none group">
                <Card className="p-6 h-full flex flex-col bg-card shadow-ambient border-0 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Education</h3>
                  <p className="text-sm text-muted-foreground">Find scholarships & skill programs.</p>
                </Card>
              </button>
              
              <button onClick={() => setInput('File a grievance')} className="text-left outline-none group">
                <Card className="p-6 h-full flex flex-col bg-card shadow-ambient border-0 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Grievance</h3>
                  <p className="text-sm text-muted-foreground">Report civic issues to authorities.</p>
                </Card>
              </button>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            
            <div className={`px-5 py-4 rounded-2xl max-w-[85%] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-card text-foreground border border-border/50 rounded-bl-sm'
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

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none flex justify-center">
        <div className="w-full max-w-4xl pointer-events-auto">
          <form onSubmit={sendMessage} className="relative bg-card shadow-premium border border-white/20 rounded-full flex items-center p-2 backdrop-blur-xl bg-white/60 dark:bg-black/40">
            <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-0 py-3 px-2 text-base focus:outline-none placeholder:text-muted-foreground/70"
              disabled={isTyping && !messages.find(m => m.isStreaming)}
            />
            <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || (isTyping && !messages.find(m => m.isStreaming))}
              className="ml-2 p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[11px] text-center text-muted-foreground mt-3 font-medium">
            AI can make mistakes. Verify important information on official government portals.
          </p>
        </div>
      </div>
    </div>
  );
}
