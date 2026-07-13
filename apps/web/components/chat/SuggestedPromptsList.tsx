import { HeartPulse, FileText, GraduationCap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SUGGESTED_PROMPTS = [
  { icon: HeartPulse, category: 'Healthcare', text: 'Find health schemes for senior citizens', color: 'text-blue-500' },
  { icon: FileText, category: 'Documents', text: 'How do I apply for a new ration card?', color: 'text-orange-500' },
  { icon: GraduationCap, category: 'Education', text: 'Scholarships for undergraduate students', color: 'text-purple-500' },
  { icon: AlertTriangle, category: 'Grievance', text: 'Report an issue with local water supply', color: 'text-red-500' },
];

export function SuggestedPromptsList({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4">
      {SUGGESTED_PROMPTS.map((prompt) => {
        const Icon = prompt.icon;
        return (
          <button
            key={prompt.text}
            type="button"
            onClick={() => onSelect(prompt.text)}
            className="flex flex-col items-center justify-center p-6 bg-[#f0f3f8] border-0 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] rounded-3xl hover:shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] transition-shadow duration-300 h-48 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="font-semibold text-gray-800 tracking-wider text-sm mb-6 uppercase">
              {prompt.category}
            </span>
            <div className={cn('flex items-center justify-center', prompt.color)}>
              <Icon className="w-16 h-16 drop-shadow-md" aria-hidden="true" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
