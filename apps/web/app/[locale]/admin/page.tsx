'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShieldAlert, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'complaints'>('catalog');
  const { accessToken, user } = useAppStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (user && user.id !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (user && user.id !== 'admin') {
    return null; // prevent rendering flash
  }

  const { data: complaintsData, isLoading: loadingComplaints } = useQuery({
    queryKey: ['admin-complaints'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/complaints`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      return res.json();
    },
    enabled: activeTab === 'complaints' && !!accessToken,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
    }
  });

  const { data: catalog, isLoading: loadingCatalog } = useQuery({
    queryKey: ['admin-catalog'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/services/search?q=`);
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const data = await res.json();
      return (data.services || []).map((s: any) => ({
        _id: s.serviceId || s._id,
        title: s.serviceName,
        type: 'service',
        department: s.department
      }));
    },
    enabled: activeTab === 'catalog',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex gap-4 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Service Catalog
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'complaints'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Complaint Review Queue
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Services & Schemes</h2>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {loadingCatalog ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {catalog?.map((item: Record<string, unknown>) => (
                      <tr key={String(item._id)} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{String(item.title)}</td>
                        <td className="px-6 py-4 capitalize">{String(item.type)}</td>
                        <td className="px-6 py-4">{String(item.department)}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {catalog?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
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

        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Queue</h2>
            
            {loadingComplaints ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : complaintsData?.items?.length > 0 ? (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Description</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {complaintsData.items.map((complaint: any) => (
                      <tr key={complaint._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{complaint.trackingId}</td>
                        <td className="px-6 py-4 capitalize">{complaint.category}</td>
                        <td className="px-6 py-4 truncate max-w-xs">{complaint.description}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {complaint.status !== 'resolved' && (
                            <button 
                              onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'resolved' })}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 text-green-600 hover:bg-green-600/10 rounded-md transition-colors disabled:opacity-50"
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No complaints found in the queue.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
