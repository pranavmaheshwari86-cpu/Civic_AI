'use client';

import { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ComplaintStatus {
  trackingId: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [searchId, setSearchId] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['complaint', searchId],
    queryFn: async () => {
      if (!searchId) return null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/complaints/${searchId}`);
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Track Your Complaint</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enter your Tracking ID to check the current status of your civic complaint.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="e.g. SB-ABCD-1234"
          className="w-full bg-card border-2 border-border rounded-full py-4 pl-14 pr-32 text-lg focus:outline-none focus:border-primary transition-colors uppercase shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
        >
          Track
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-6 text-center max-w-xl mx-auto">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <h3 className="font-semibold text-lg">Not Found</h3>
          <p className="opacity-90">We couldn&apos;t find a complaint with that Tracking ID. Please check and try again.</p>
        </div>
      )}

      {data && (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tracking ID</p>
              <h2 className="text-2xl font-mono font-bold">{data.trackingId}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
              <p className="font-semibold">{data.category}</p>
            </div>
          </div>

          <div className="relative pt-8">
            <div className="absolute top-10 left-6 bottom-0 w-0.5 bg-border -z-10" />
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${data.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${data.status === 'Resolved' ? 'text-green-600' : 'text-muted-foreground'}`}>Resolved</h4>
                  <p className="text-sm text-muted-foreground">The issue has been fixed by the authorities.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${data.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : data.status === 'Resolved' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Loader2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${data.status === 'In Progress' ? 'text-blue-600' : data.status === 'Resolved' ? 'text-foreground' : 'text-muted-foreground'}`}>In Progress</h4>
                  <p className="text-sm text-muted-foreground">Action is currently being taken.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Complaint Filed</h4>
                  <p className="text-sm text-muted-foreground">
                    Received on {new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
