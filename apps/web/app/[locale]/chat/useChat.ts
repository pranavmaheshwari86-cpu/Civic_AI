import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function useChat() {
  const { conversationId, setConversationId, accessToken } = useAppStore();
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: historyData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/chat/conversations/${conversationId}`,
        { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
      );
      if (!res.ok) throw new Error('Failed to load conversation history');
      return res.json() as Promise<{ messages: Array<{ role: 'user' | 'assistant'; content: string }> }>;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const historyMessages: Message[] = useMemo(
    () =>
      historyData?.messages?.map((m, index) => ({
        id: `history-${index}`,
        role: m.role,
        content: m.content,
      })) ?? [],
    [historyData]
  );

  const messages = useMemo(
    () => [...historyMessages, ...userMessages],
    [historyMessages, userMessages]
  );

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = text ?? input;
      if (!content.trim()) return;

      const userMessage: Message = { id: Date.now().toString(), role: 'user', content };
      setIsTyping(true);
      setUserMessages((prev) => [...prev, userMessage]);
      setInput('');
      inputRef.current?.focus();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/chat/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({ message: content, conversationId }),
          }
        );

        if (!response.ok) throw new Error('Failed to send message');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error('No reader');

        const assistantMessageId = (Date.now() + 1).toString();
        setUserMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsTyping(false);
              setUserMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                )
              );
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'token') {
                setUserMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: m.content + parsed.data }
                      : m
                  )
                );
              } else if (parsed.type === 'done') {
                setIsTyping(false);
                setUserMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                  )
                );
                const newConvId = parsed.data.conversationId;
                if (newConvId && newConvId !== conversationId) setConversationId(newConvId);
                if (parsed.data.intentCategory === 'emergency') setIsEmergency(true);
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }
      } catch (error) {
        console.error(error);
        setUserMessages((prev) => [
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
    },
    [input, accessToken, conversationId, setConversationId]
  );

  return {
    messages,
    input,
    setInput,
    isTyping,
    isEmergency,
    setIsEmergency,
    messagesEndRef,
    inputRef,
    sendMessage,
  };
}
