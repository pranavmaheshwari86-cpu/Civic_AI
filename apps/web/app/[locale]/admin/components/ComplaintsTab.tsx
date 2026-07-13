'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export interface ComplaintItem {
  _id: string;
  trackingId: string;
  category: string;
  status: string;
}

interface ComplaintsResponse {
  data: ComplaintItem[];
}

interface ComplaintsTabProps {
  onViewDetails: (item: ComplaintItem) => void;
}

export function ComplaintsTab({ onViewDetails }: ComplaintsTabProps) {
  const { data: complaints, isLoading: loadingComplaints } = useQuery({
    queryKey: ['admin-complaints'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/complaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      return res.json() as Promise<ComplaintsResponse>;
    },
    staleTime: 60 * 1000,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Review Queue</h2>

      {loadingComplaints ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Tracking ID</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints?.data?.map((item) => (
                <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{item.trackingId}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                      onClick={() => onViewDetails(item)}
                      aria-label={`View details for complaint ${item.trackingId}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {(!complaints?.data || complaints.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No complaints in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}