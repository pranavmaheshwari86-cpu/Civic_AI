'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { X, Tag, User, Bot, FileText, Clock, CheckCircle, AlertCircle, MapPin, Loader2 } from 'lucide-react';

interface ComplaintDetail {
  _id: string;
  trackingId: string;
  status: string;
  category: string;
  priority?: string;
  description?: string;
  userId?: string;
  confidenceFlag?: string;
  location?: {
    address?: string;
    lat: number;
    lng: number;
  };
  photoUrls?: string[];
}

interface ComplaintDetailDrawerProps {
  complaint: ComplaintDetail | null;
  onClose: () => void;
}

const getStatusClass = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'resolved') return 'bg-green-100 text-green-700';
  if (s === 'in_progress' || s === 'in progress') return 'bg-blue-100 text-blue-700';
  return 'bg-muted text-muted-foreground';
};

const getPriorityClass = (priority: string) => {
  const p = priority.toLowerCase();
  if (p === 'high' || p === 'critical') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

export function ComplaintDetailDrawer({ complaint, onClose }: ComplaintDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [adminNote, setAdminNote] = useState('');
  const [assignee, setAssignee] = useState('');

  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, status, note, assignedTo }: { id: string; status?: string; note?: string; assignedTo?: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify({ status, note, assignedTo })
      });
      if (!res.ok) throw new Error('Failed to update complaint');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
    }
  });

  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg bg-background h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right-8 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Complaint Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Close complaint details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Tracking ID</p>
              <p className="font-mono">{complaint.trackingId}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(complaint.status)}`}>
                {complaint.status.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Category</p>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{complaint.category.replace('_', ' ')}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Priority</p>
              <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getPriorityClass(complaint.priority || 'Medium')}`}>
                {complaint.priority || 'Medium'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Description</p>
            <div className="bg-muted p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
              {complaint.description || 'No description provided.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Citizen Details</p>
              <div className="bg-muted p-4 rounded-xl text-sm space-y-2">
                <p><span className="font-medium">ID:</span> UID-***{String(complaint.userId || '1234').slice(-4)}</p>
                <p className="text-xs text-muted-foreground italic">PII masked per DPDP Act.</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><Bot className="w-4 h-4" /> AI Summary</p>
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-sm text-primary/90 leading-relaxed">
                {complaint.confidenceFlag === 'high' ? 'High confidence match. Immediate action recommended.' : 'Requires manual review. Pattern matches typical infrastructural issues.'}
              </div>
            </div>
          </div>

          {complaint.location && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</p>
              <div className="bg-muted p-4 rounded-xl flex items-start gap-3 text-sm">
                <div>
                  <p className="font-medium">{complaint.location.address || 'Address not provided'}</p>
                  <p className="text-muted-foreground text-xs mt-1 font-mono">Lat: {complaint.location.lat}, Lng: {complaint.location.lng}</p>
                </div>
              </div>
            </div>
          )}

          {complaint.photoUrls && complaint.photoUrls.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Attachments</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {complaint.photoUrls.map((url) => (
                  <Image
                    key={url}
                    src={url}
                    alt={`Attachment`}
                    width={96}
                    height={96}
                    className="h-24 w-24 object-cover rounded-lg border border-border"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold mb-4 text-lg">Admin Actions</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="assignee" className="text-sm font-medium">Assign To Department</label>
                  <select
                    id="assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Department...</option>
                    <option value="PWD">Public Works (PWD)</option>
                    <option value="Water">Water Board</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="adminNote" className="text-sm font-medium">Add Internal Note</label>
                  <input
                    id="adminNote"
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Internal note (optional)"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  disabled={updateComplaintMutation.isPending}
                  onClick={() => updateComplaintMutation.mutate({ id: complaint._id, status: 'in_progress', note: adminNote, assignedTo: assignee })}
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updateComplaintMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  Mark In Progress
                </button>
                <button
                  type="button"
                  disabled={updateComplaintMutation.isPending}
                  onClick={() => updateComplaintMutation.mutate({ id: complaint._id, status: 'resolved', note: adminNote, assignedTo: assignee })}
                  className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updateComplaintMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Resolve
                </button>
                <button
                  type="button"
                  disabled={updateComplaintMutation.isPending}
                  onClick={() => updateComplaintMutation.mutate({ id: complaint._id, status: 'closed', note: adminNote, assignedTo: assignee })}
                  className="w-full md:w-auto bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updateComplaintMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                  Reject / Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}