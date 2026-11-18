import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { subscribeToNewsletter } from '../services/supabaseService';
import {
  validateNewsletterEmail,
  formatSubscriptionConfirmation,
} from '../utils/newsletter';

interface NewsletterSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterSignupModal: React.FC<NewsletterSignupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setMessage(null);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNewsletterEmail(email);

    if (!validation.isValid) {
      setStatus('error');
      setMessage(validation.errorMessage);
      return;
    }

    setStatus('submitting');
    setMessage(null);

    try {
      const result = await subscribeToNewsletter(validation.normalizedEmail);
      setStatus('success');
      setMessage(
        formatSubscriptionConfirmation(
          result.email,
          Boolean(result.alreadySubscribed)
        )
      );
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Unable to complete subscription right now. Please try again.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#0D0D0D] border border-[#E5E5E5] dark:border-[#222222] rounded-2xl overflow-hidden shadow-2xl transition-colors">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-[#34A499]" />

        {/* Header */}
        <div className="px-6 py-4 bg-[#FFFFFF] dark:bg-[#121212] border-b border-[#E5E5E5] dark:border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34A499]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#34A499] font-semibold">
              ZYNIQ DISPATCH
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close newsletter modal"
            className="p-1.5 rounded-lg text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7">
          {status === 'success' ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-11 h-11 rounded-full bg-[#34A499]/10 border border-[#34A499]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#34A499]" />
              </div>
              <div className="space-y-1.5">
                <h3
                  id="newsletter-modal-title"
                  className="font-display text-lg font-bold text-[#1A1A1A] dark:text-white"
                >
                  Subscription Active
                </h3>
                <p className="text-xs font-mono text-[#666666] dark:text-[#AAAAAA] leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setMessage(null);
                  }}
                  className="px-4 py-2 text-xs font-mono text-[#666666] dark:text-[#AAAAAA] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E5] dark:border-[#262626] rounded-lg transition-colors cursor-pointer"
                >
                  Add Another Email
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3
                  id="newsletter-modal-title"
                  className="font-display text-xl font-bold text-[#1A1A1A] dark:text-white tracking-tight"
                >
                  Subscribe to ZYNIQ Dispatches
                </h3>
                <p className="text-xs text-[#666666] dark:text-[#888888] font-mono leading-relaxed">
                  Receive curated architectural briefs on synthetic intelligence, sovereign compute, and low-latency hardware systems directly in your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="newsletter-modal-email"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[#555555] dark:text-[#AAAAAA] mb-1.5"
                  >
                    Email Address
                  </label>
                  <div
                    className={`flex items-center bg-[#FAFAFA] dark:bg-[#141414] border rounded-xl transition-colors ${
                      status === 'error'
                        ? 'border-red-500'
                        : 'border-[#E5E5E5] dark:border-[#262626] focus-within:border-[#34A499] dark:focus-within:border-[#34A499]'
                    }`}
                  >
                    <span className="pl-3.5 pr-2 text-[#777777] dark:text-[#666666] pointer-events-none">
                      <Mail className="w-4 h-4 text-[#34A499]" />
                    </span>
                    <input
                      ref={inputRef}
                      id="newsletter-modal-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setMessage(null);
                        }
                      }}
                      disabled={status === 'submitting'}
                      placeholder="architect@domain.io"
                      className="w-full py-2.5 pr-3.5 bg-transparent text-xs font-mono text-[#1A1A1A] dark:text-white placeholder-[#888888] dark:placeholder-[#555555] focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {status === 'error' && message && (
                    <p
                      role="alert"
                      className="mt-1.5 text-[11px] font-mono text-red-500 dark:text-red-400"
                    >
                      {message}
                    </p>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-[#777777] dark:text-[#666666]">
                    ZERO NOISE · UNSUBSCRIBE ANYTIME
                  </span>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <span>{status === 'submitting' ? 'Subscribing...' : 'Subscribe'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
