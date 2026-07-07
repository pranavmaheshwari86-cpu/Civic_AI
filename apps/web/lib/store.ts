import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  preferredLanguage: string;
}

interface AppState {
  user: User | null;
  accessToken: string | null;
  language: 'en' | 'hi';
  conversationId: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setConversationId: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      language: 'en',
      conversationId: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
      setLanguage: (language) => set({ language }),
      setConversationId: (conversationId) => set({ conversationId }),
    }),
    {
      name: 'smart-bharat-storage',
      // We only persist non-PII or tokens that are okay in local storage (accessToken has 15m expiry, refreshToken is httpOnly).
      // But rule 47: "Form data preserved in Zustand during session. Not in localStorage (PII risk)."
      // We will only persist language and conversationId.
      partialize: (state) => ({ language: state.language, conversationId: state.conversationId }),
    }
  )
);
