'use client';

import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service in production
    console.error('[CivicAI] Page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
        An unexpected error occurred. You can try refreshing the page or go back to the homepage.
        {error.digest && (
          <span className="block mt-2 text-xs font-mono opacity-60">Error ID: {error.digest}</span>
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          <RefreshCcw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-semibold px-6 py-3 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
