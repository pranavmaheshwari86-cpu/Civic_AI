'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ShieldCheck, MapPin, Camera, AlertCircle, Loader2, CheckCircle2, Copy, Check, X, Navigation } from 'lucide-react';

type LocationState =
  | { status: 'detecting' }
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied' }
  | { status: 'unavailable' };

export default function ComplaintsPage() {
  const router = useRouter();
  const { accessToken } = useAppStore();

  const [category, setCategory] = useState('Sanitation');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation state
  const [location, setLocation] = useState<LocationState>({ status: 'detecting' });

  // Request geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: 'unavailable' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: 'granted',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ status: 'denied' });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(successTrackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed silently
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const locationPayload =
      location.status === 'granted'
        ? { lat: location.lat, lng: location.lng }
        : null;

    try {
      const body: Record<string, unknown> = { category, description };
      if (locationPayload) body.location = locationPayload;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/complaints`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to file complaint');

      const data = await response.json();
      setSuccessTrackingId(data.trackingId);
    } catch {
      setSubmitError('Failed to submit your complaint. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ────────────────────────────────────────────────────────
  if (successTrackingId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div
          className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Complaint Filed Successfully</h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          Your complaint has been forwarded to the respective department. Use the tracking ID below to check its status.
        </p>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Your Tracking ID</p>
          <p className="text-2xl font-mono font-bold tracking-wider mb-4">{successTrackingId}</p>
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label={copied ? 'Copied to clipboard' : 'Copy tracking ID to clipboard'}
          >
            {copied ? (
              <><Check className="w-4 h-4" aria-hidden="true" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" aria-hidden="true" /> Copy ID</>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push(`/track?id=${successTrackingId}`)}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            Track this Complaint
          </button>
          <button
            onClick={() => { setSuccessTrackingId(''); setCopied(false); }}
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-semibold px-6 py-3 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            File Another Complaint
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-balance">Report an Issue</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Help us keep your city clean and safe. Report civic issues directly to the authorities.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 bg-card border border-border p-8 rounded-2xl shadow-sm"
        noValidate
        aria-label="File a civic complaint"
      >
        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="complaint-category" className="block text-sm font-semibold">
            Category
          </label>
          <select
            id="complaint-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-sm"
          >
            <option value="Sanitation">Sanitation (Garbage, Drains)</option>
            <option value="Roads">Roads (Potholes, Streetlights)</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="complaint-description" className="block text-sm font-semibold">
              Description <span className="text-destructive" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <span
              className="text-xs text-muted-foreground tabular-nums"
              aria-live="polite"
              aria-label={`${description.length} of 500 characters`}
            >
              {description.length}/500
            </span>
          </div>
          <textarea
            id="complaint-description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            required
            placeholder="Describe the issue in detail. Include the street name, landmark, or any other helpful information..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors text-sm"
            aria-required="true"
            aria-describedby="description-hint"
          />
          <p id="description-hint" className="text-xs text-muted-foreground">
            Be specific — include street name, landmark, or any relevant details.
          </p>
        </div>

        {/* Evidence / Photo Upload */}
        <div className="space-y-2">
          <label htmlFor="complaint-photo" className="block text-sm font-semibold">
            Evidence <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            id="complaint-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoChange}
            aria-describedby="photo-hint"
          />

          {photoPreview ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt={`Preview of ${photoFile?.name ?? 'uploaded photo'}`}
                className="w-full max-h-48 object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label="Upload a photo as evidence"
            >
              <Camera className="w-7 h-7 mb-2" aria-hidden="true" />
              <span className="text-sm font-medium">Click to upload photo</span>
              <span id="photo-hint" className="text-xs mt-1">PNG, JPG, WEBP up to 10MB</span>
            </button>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold" id="location-label">Location</span>
          <div
            role="status"
            aria-labelledby="location-label"
            className="bg-muted rounded-lg p-4 flex items-center justify-between border border-border"
          >
            <div className="flex items-center gap-3">
              {location.status === 'detecting' ? (
                <>
                  <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">Detecting location...</span>
                </>
              ) : location.status === 'granted' ? (
                <>
                  <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">Location detected</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {location.status === 'denied'
                      ? 'Location access denied'
                      : 'Location unavailable'}
                  </span>
                </>
              )}
            </div>
            {location.status === 'granted' && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            )}
            {(location.status === 'denied' || location.status === 'unavailable') && (
              <span className="text-xs text-muted-foreground">Complaint filed without location</span>
            )}
          </div>
          {(location.status === 'denied' || location.status === 'unavailable') && (
            <p className="text-xs text-muted-foreground">
              {location.status === 'denied'
                ? 'Please enable location access in your browser settings to attach your location.'
                : 'Location services are not available on this device.'}
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div
          className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3"
          role="note"
          aria-label="Information about complaint processing"
        >
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            CivicAI uses AI to detect duplicate complaints and groups them together to prioritise action by the authorities.
          </p>
        </div>

        {/* Inline error message */}
        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !description.trim()}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-disabled={isSubmitting || !description.trim()}
          aria-describedby={!description.trim() ? 'submit-hint' : undefined}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            'File Complaint'
          )}
        </button>
        {!description.trim() && (
          <p id="submit-hint" className="text-xs text-muted-foreground text-center -mt-4">
            Please add a description before submitting.
          </p>
        )}
      </form>
    </div>
  );
}
