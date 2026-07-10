import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Loader2 className="w-10 h-10 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
