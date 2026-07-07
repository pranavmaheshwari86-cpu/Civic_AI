'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ShieldCheck, MapPin, Camera, AlertCircle, Loader2 } from 'lucide-react';

export default function ComplaintsPage() {
  const [category, setCategory] = useState('Sanitation');
  const [description, setDescription] = useState('');
  const location = { lat: 28.6139, lng: 77.2090 };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState('');
  const { accessToken } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          category,
          description,
          location,
        }),
      });

      if (!response.ok) throw new Error('Failed to file complaint');

      const data = await response.json();
      setSuccessTrackingId(data.trackingId);
    } catch (error) {
      console.error(error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successTrackingId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Complaint Filed Successfully</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your complaint has been forwarded to the respective department.
        </p>
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-2">Your Tracking ID</p>
          <p className="text-2xl font-mono font-bold tracking-wider">{successTrackingId}</p>
        </div>
        <button
          onClick={() => setSuccessTrackingId('')}
          className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
        >
          File Another Complaint
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Report an Issue</h1>
        <p className="text-muted-foreground text-lg">
          Help us keep your city clean and safe. Report civic issues directly to the authorities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-2xl shadow-sm">
        <div className="space-y-4">
          <label className="block text-sm font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="Sanitation">Sanitation (Garbage, Drains)</option>
            <option value="Roads">Roads (Potholes, Streetlights)</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the issue in detail..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold">Evidence (Optional)</label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <Camera className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Click to upload photo</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold">Location</label>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between border border-border">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Using Current Location</span>
            </div>
            <span className="text-xs text-muted-foreground">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Smart Bharat uses AI to detect duplicate complaints and groups them together to prioritize action by the authorities.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !description}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'File Complaint'
          )}
        </button>
      </form>
    </div>
  );
}
