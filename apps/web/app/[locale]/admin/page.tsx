'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ShieldAlert, Plus, Edit2, Trash2, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AdminDashboard() {
  const { accessToken } = useAppStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'complaints'>('catalog');

  // Auth guard — do not render admin content without a valid session token
  if (!accessToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Admin Access Required</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          You must be signed in with an administrator account to view this page. This section is not publicly accessible.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return <AdminContent activeTab={activeTab} setActiveTab={setActiveTab} />;
}

function AdminContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'catalog' | 'complaints';
  setActiveTab: (tab: 'catalog' | 'complaints') => void;
}) {
  const { accessToken } = useAppStore();

  const { isLoading: loadingComplaints } = useQuery({
    queryKey: ['admin-complaints'],
    queryFn: async () => [],
    enabled: activeTab === 'complaints',
  });

  const { data: catalog, isLoading: loadingCatalog } = useQuery({
    queryKey: ['admin-catalog'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/catalog/search?q=`,
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );
      if (!res.ok) throw new Error('Failed to fetch catalog');
      return res.json();
    },
    enabled: activeTab === 'catalog',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center gap-4 mb-8">
        <ShieldAlert className="w-7 h-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-border mb-6"
        role="tablist"
        aria-label="Admin sections"
      >
        <button
          role="tab"
          id="tab-catalog"
          aria-controls="panel-catalog"
          aria-selected={activeTab === 'catalog'}
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t -mb-px ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Service Catalog
        </button>
        <button
          role="tab"
          id="tab-complaints"
          aria-controls="panel-complaints"
          aria-selected={activeTab === 'complaints'}
          onClick={() => setActiveTab('complaints')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t -mb-px ${
            activeTab === 'complaints'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Complaint Review Queue
        </button>
      </div>

      {/* Catalog tab panel */}
      <div
        role="tabpanel"
        id="panel-catalog"
        aria-labelledby="tab-catalog"
        hidden={activeTab !== 'catalog'}
        className="flex-1"
      >
        {activeTab === 'catalog' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Manage Services &amp; Schemes</h2>
              <button
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px]"
                aria-label="Add new service or scheme"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add New
              </button>
            </div>

            {loadingCatalog ? (
              <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
                <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
                <span className="sr-only">Loading catalog...</span>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Type</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Department</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {catalog?.map((item: Record<string, unknown>) => (
                      <tr key={String(item._id)} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4 font-medium">{String(item.title)}</td>
                        <td className="px-6 py-4 capitalize">{String(item.type)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{String(item.department)}</td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Edit ${String(item.title)}`}
                          >
                            <Edit2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Delete ${String(item.title)}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!catalog || catalog.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          No items found in the catalog.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complaints tab panel */}
      <div
        role="tabpanel"
        id="panel-complaints"
        aria-labelledby="tab-complaints"
        hidden={activeTab !== 'complaints'}
        className="flex-1"
      >
        {activeTab === 'complaints' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold">Review Queue</h2>
            {loadingComplaints ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
                <ShieldAlert className="w-10 h-10 mx-auto mb-4 opacity-40" aria-hidden="true" />
                <p className="font-medium">Complaint Queue API not yet implemented in backend.</p>
                <p className="text-sm mt-1 opacity-70">
                  This feature will be available once the backend endpoint is ready.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
