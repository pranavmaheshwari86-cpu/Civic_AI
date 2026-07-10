'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface ComplaintStatus {
  trackingId: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Timeline order: oldest at bottom, newest at top (chronological top-down = Filed → In Progress → Resolved)
type TimelineStep = {
  key: 'Filed' | 'In Progress' | 'Resolved';
  label: string;
  description: string;
  activeClass: string;
  labelClass: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: 'Filed',
    label: 'Complaint Filed',
    description: 'Your complaint was received and registered.',
    activeClass: 'bg-primary/20 text-primary',
    labelClass: 'text-foreground',
  },
  {
    key: 'In Progress',
    label: 'In Progress',
    description: 'Action is currently being taken by the department.',
    activeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    labelClass: 'text-blue-700 dark:text-blue-400',
  },
  {
    key: 'Resolved',
    label: 'Resolved',
    description: 'The issue has been fixed by the authorities.',
    activeClass: 'bg-primary/10 text-primary',
    labelClass: 'text-primary',
  },
];

const STATUS_RANK: Record<string, number> = {
  Open: 1,
  'In Progress': 2,
  Resolved: 3,
};

function isStepReached(step: TimelineStep['key'], currentStatus: string) {
  const stepRank = step === 'Filed' ? 1 : step === 'In Progress' ? 2 : 3;
  return STATUS_RANK[currentStatus] >= stepRank;
}

export default function TrackPage() {
  const searchParams = useSearchParams();
  const prefilledId = searchParams.get('id') ?? '';

  const [trackingId, setTrackingId] = useState(prefilledId);
  const [searchId, setSearchId] = useState(prefilledId); // auto-search if pre-filled

  // Auto-search when navigated from success screen with ?id=
  useEffect(() => {
    if (prefilledId) {
      setTrackingId(prefilledId);
      setSearchId(prefilledId);
    }
  }, [prefilledId]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['complaint', searchId],
    queryFn: async () => {
      if (!searchId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/complaints/${searchId}`
      );
      if (!res.ok) throw new Error('Complaint not found');
      return res.json() as Promise<ComplaintStatus>;
    },
    enabled: !!searchId,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchId(trackingId.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-4">
        <Link
          href="/complaints"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Complaints
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-balance">Track Your Complaint</h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
          Enter your Tracking ID to check the current status of your civic complaint.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="relative max-w-xl mx-auto mb-10"
        role="search"
        aria-label="Complaint tracker"
      >
        <label htmlFor="tracking-input" className="sr-only">
          Enter your tracking ID
        </label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="tracking-input"
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          placeholder="e.g. SB-ABCD-1234"
          className="w-full bg-card border-2 border-border rounded-full py-3.5 pl-12 pr-28 text-base focus:outline-none focus:border-primary transition-colors shadow-sm uppercase font-mono tracking-wider"
          autoComplete="off"
          aria-label="Tracking ID"
        />
        <button
          type="submit"
          disabled={!trackingId.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Track complaint"
        >
          Track
        </button>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
          <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Loading complaint status...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-6 text-center max-w-xl mx-auto"
        >
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" aria-hidden="true" />
          <h2 className="font-semibold text-lg">Not Found</h2>
          <p className="opacity-90 text-sm mt-1">
            We couldn&apos;t find a complaint with that Tracking ID. Please check and try again.
          </p>
        </div>
      )}

      {/* Result */}
      {data && (
        <div
          className="bg-card border border-border rounded-2xl p-8 shadow-sm max-w-2xl mx-auto"
          aria-label={`Complaint status for ${data.trackingId}`}
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tracking ID</p>
              <h2 className="text-2xl font-mono font-bold">{data.trackingId}</h2>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
              <p className="font-semibold">{data.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
              <span
                className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                  data.status === 'Resolved'
                    ? 'bg-primary/10 text-primary'
                    : data.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>

          {/* Chronological timeline: Filed → In Progress → Resolved (top to bottom) */}
          <div className="relative" aria-label="Complaint progress timeline">
            {/* Vertical connector */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"
              aria-hidden="true"
            />

            <ol className="space-y-6 list-none">
              {TIMELINE_STEPS.map((step) => {
                const reached = isStepReached(step.key, data.status);
                const isCurrent =
                  step.key === 'Filed'
                    ? data.status === 'Open'
                    : step.key === data.status;

                return (
                  <li key={step.key} className="flex gap-4 relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                        reached ? step.activeClass : 'bg-muted text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    >
                      {step.key === 'Resolved' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : step.key === 'In Progress' ? (
                        <Loader2 className={`w-6 h-6 ${isCurrent ? 'animate-spin' : ''}`} />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                    </div>
                    <div className="pt-2">
                      <h3
                        className={`text-base font-bold ${
                          reached ? step.labelClass : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {step.key === 'Filed'
                          ? `Received on ${new Date(data.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}`
                          : step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
