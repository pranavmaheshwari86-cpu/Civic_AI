import { useEffect, useRef } from 'react';
import { m as motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
}

export function EmergencyModal({ isOpen, onClose, reducedMotion }: EmergencyModalProps) {
  const firstActionRef = useRef<HTMLAnchorElement>(null);
  const shortTransition = reducedMotion ? { duration: 0 } : { duration: 0.2 };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => firstActionRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shortTransition}
            className="fixed inset-0 z-50 bg-black/60"
            aria-hidden="true"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-title"
            aria-describedby="emergency-desc"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-gutter pointer-events-none"
          >
            <div className="bg-surface-container-lowest rounded-2xl p-lg max-w-md w-full shadow-2xl border border-error/40 pointer-events-auto">
              <div className="flex items-center gap-sm text-error mb-md">
                <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                <h2 id="emergency-title" className="font-headline-md text-headline-md font-bold">
                  Emergency Detected
                </h2>
              </div>
              <p id="emergency-desc" className="font-body-md text-body-md text-on-surface-variant mb-lg">
                It seems you are reporting a life-threatening emergency. Please contact emergency services immediately.
              </p>

              <div className="flex flex-col gap-sm mb-lg">
                {[
                  { label: 'National Emergency', number: '112' },
                  { label: 'Ambulance', number: '108' },
                  { label: 'Fire', number: '101' },
                ].map(({ label, number }, i) => (
                  <a
                    key={number}
                    href={`tel:${number}`}
                    ref={i === 0 ? firstActionRef : undefined}
                    className="flex items-center justify-between p-sm rounded-xl border border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-secondary outline-none cursor-pointer"
                  >
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      {label}
                    </span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">
                      {number}
                    </span>
                  </a>
                ))}
              </div>

              <Button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg"
              >
                I acknowledge, continue to chat
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
