import { forwardRef } from 'react';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
  isInputDisabled: boolean;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ input, setInput, onSubmit, isTyping, isInputDisabled }, ref) => {
    return (
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#f0f3f8] via-[#f0f3f8] to-transparent pt-12 pb-6 px-4 z-20">
        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={onSubmit}
            className="relative bg-[#f0f3f8] border-0 rounded-full shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] flex items-center pl-4 pr-2 py-2 transition-all duration-200 focus-within:shadow-[inset_8px_8px_16px_#c5cddb,inset_-8px_-8px_16px_#ffffff]"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Use microphone"
              className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Attach document"
              className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-transparent"
            >
              <Paperclip className="w-5 h-5" aria-hidden="true" />
            </Button>
            <input
              ref={ref}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your query here..."
              aria-label="Message input"
              disabled={isInputDisabled}
              className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-gray-800 placeholder:text-gray-400 py-2 px-3 h-12 outline-none disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isInputDisabled}
              aria-label="Send message"
              className="rounded-2xl shadow-sm active:scale-95 transition-all h-10 w-10 ml-2 flex items-center justify-center bg-[#291e5e] hover:bg-[#1a1340] text-white"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-4 h-4 ml-[-2px] mb-[-2px]" aria-hidden="true" />
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }
);
ChatInput.displayName = 'ChatInput';
