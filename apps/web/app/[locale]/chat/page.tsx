'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/chat/message`, {
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
    <div className="flex-1 flex flex-col h-full bg-surface relative min-h-screen">
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto chat-scroll pt-20 md:pt-md pb-32 px-gutter lg:px-xl max-w-4xl mx-auto w-full relative z-10">
        
        {messages.length === 0 && (
          <div className="py-xl flex flex-col items-center justify-center text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] animate-fadeIn">
            <div className="w-20 h-20 mb-md rounded-2xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg ai-thinking-orb">
              <span className="material-symbols-outlined text-4xl text-on-primary-container">smart_toy</span>
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-sm">Good morning, Citizen.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">I'm Bharat AI, your sovereign digital assistant. How can I help you navigate government services today?</p>
            
            {/* Suggested Prompts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-xl w-full max-w-2xl text-left">
              <button onClick={() => setInput('Find health schemes for senior citizens')} className="bg-surface-container-lowest border border-outline-variant/50 p-sm rounded-xl hover:shadow-[0_12px_34px_-10px_rgba(15,23,42,0.08)] hover:border-secondary transition-all group text-left outline-none">
                <div className="flex items-center gap-xs text-secondary mb-xs">
                  <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wide">Healthcare</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Find health schemes for senior citizens</p>
              </button>
              
              <button onClick={() => setInput('How do I apply for a new ration card?')} className="bg-surface-container-lowest border border-outline-variant/50 p-sm rounded-xl hover:shadow-[0_12px_34px_-10px_rgba(15,23,42,0.08)] hover:border-secondary transition-all group text-left outline-none">
                <div className="flex items-center gap-xs text-tertiary-container mb-xs">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wide">Documents</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">How do I apply for a new ration card?</p>
              </button>
              
              <button onClick={() => setInput('Scholarships for undergraduate students')} className="bg-surface-container-lowest border border-outline-variant/50 p-sm rounded-xl hover:shadow-[0_12px_34px_-10px_rgba(15,23,42,0.08)] hover:border-secondary transition-all group text-left outline-none">
                <div className="flex items-center gap-xs text-primary mb-xs">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wide">Education</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Scholarships for undergraduate students</p>
              </button>
              
              <button onClick={() => setInput('Report an issue with local water supply')} className="bg-surface-container-lowest border border-outline-variant/50 p-sm rounded-xl hover:shadow-[0_12px_34px_-10px_rgba(15,23,42,0.08)] hover:border-secondary transition-all group text-left outline-none">
                <div className="flex items-center gap-xs text-error mb-xs">
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wide">Grievance</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Report an issue with local water supply</p>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-xl py-md">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-md max-w-3xl ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container shadow-sm mt-xs">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
              )}
              
              {msg.role === 'user' ? (
                <div className="bg-surface-container-low px-md py-sm rounded-2xl rounded-tr-sm text-on-surface font-body-md text-body-md shadow-sm whitespace-pre-wrap">
                  {msg.content}
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  <div className="text-on-surface font-body-md text-body-md prose prose-slate">
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && !messages.find(m => m.isStreaming) && (
            <div className="flex gap-md max-w-3xl mt-md">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center text-outline mt-xs ai-thinking-orb border-2 border-secondary/20">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </div>
              <div className="flex items-center">
                <span className="text-outline font-label-md text-label-md animate-pulse">Searching official databases...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area Container (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-xl pb-md px-gutter z-20 md:ml-0">
        <div className="max-w-4xl mx-auto relative group">
          {/* Glowing effect behind input */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-tertiary-container/20 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
          
          <form onSubmit={sendMessage} className="relative bg-surface-container-lowest border border-outline-variant/50 rounded-full shadow-lg flex items-center pl-sm pr-xs py-xs focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
            <button type="button" className="p-xs text-outline hover:text-primary transition-colors rounded-full hover:bg-surface-container-low" title="Upload Document">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-outline py-sm px-xs h-12 outline-none" 
              placeholder="Ask Bharat AI..."
              disabled={isTyping && !messages.find(m => m.isStreaming)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || (isTyping && !messages.find(m => m.isStreaming))}
              className="p-sm bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </form>
          
          <div className="text-center mt-xs">
            <p className="font-label-sm text-label-sm text-outline text-[10px]">AI can make mistakes. Verify important information with official sources.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
