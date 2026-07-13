'use client';

import { useState, useRef } from 'react';
import { UploadCloud, ShieldCheck, Loader2, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ type: string; confidence: number; extractedText: string; piiMasked: boolean; message?: string; masked?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!hasConsented) {
        setShowConsentModal(true);
      }
    }
  };

  const handleConsentAccept = () => {
    setHasConsented(true);
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    setFile(null);
    setShowConsentModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processDocument = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      // In a real flow, we would get a presigned URL, upload to R2, and send the R2 URL to /document/process.
      // For this demo, we skip the R2 upload and just simulate the API call directly.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/document/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: 'mock-s3-url' }),
      });
      
      if (!response.ok) throw new Error('Failed to process document');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-32 pb-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Document Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Upload Aadhaar, PAN, or other documents for instant verification. Your PII is automatically masked for privacy.
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
        {!result ? (
          <div className="space-y-6 text-center">
            <div 
              className="border-2 border-dashed border-border rounded-xl p-12 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select Document</h3>
              <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
            </div>

            {file && hasConsented && (
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={processDocument}
                  disabled={isProcessing}
                  className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    'Verify & Mask'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center">Verification Complete</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Document Type</p>
                <p className="font-semibold text-lg">{result.type}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                <p className="font-semibold text-lg text-green-600">{Math.round(result.confidence * 100)}%</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4 text-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h3 className="font-semibold text-lg">Privacy Layer Active</h3>
              </div>
              <p className="text-sm text-blue-800/80 dark:text-blue-300/80 mb-4">
                {result.message}
              </p>
              
              <div className="relative w-full aspect-[1.6] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-border">
                {/* Simulated original document background */}
                <div className="absolute inset-0 opacity-20 flex flex-col p-4 justify-between">
                  <div className="h-6 w-32 bg-slate-400 rounded"></div>
                  <div className="flex justify-between items-end">
                    <div className="w-24 h-32 bg-slate-400 rounded"></div>
                    <div className="h-12 w-48 bg-slate-400 rounded"></div>
                  </div>
                </div>
                
                {/* Simulated Masks */}
                {result.masked && (
                  <>
                    <div className="absolute bottom-6 right-6 w-56 h-14 bg-black/80 dark:bg-black backdrop-blur-md rounded-md flex items-center justify-center border border-white/20">
                      <span className="text-white/90 text-sm font-mono tracking-widest">XXXX XXXX XXXX</span>
                    </div>
                    <div className="absolute top-1/2 left-1/3 w-32 h-6 bg-black/80 dark:bg-black backdrop-blur-md rounded-sm border border-white/20"></div>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setFile(null);
                setHasConsented(false);
              }}
              className="w-full text-center py-4 text-primary font-semibold hover:underline"
            >
              Verify Another Document
            </button>
          </div>
        )}
      </div>

      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Data Privacy Consent</h2>
                  <p className="text-sm text-muted-foreground">Digital Personal Data Protection (DPDP) Act</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-foreground">
                Before uploading your document, please review our privacy commitment:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
                <li>Your document is used strictly for identity verification.</li>
                <li><strong>Sensitive PII (like Aadhaar/PAN digits) will be automatically masked by AI</strong> before being processed or stored.</li>
                <li>Your unmasked document is never saved on our servers.</li>
                <li>You can request deletion of this verification record at any time.</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
                By clicking &quot;I Consent&quot;, you agree to the processing of this document under these terms.
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/30 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleConsentDecline}
                className="px-6 py-2.5 rounded-lg font-medium hover:bg-muted transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConsentAccept}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                I Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
