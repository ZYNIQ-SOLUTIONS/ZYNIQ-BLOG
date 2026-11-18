import React, { useState } from 'react';
import { ArrowRight, Check, Terminal } from 'lucide-react';
import { subscribeToNewsletter } from '../services/supabaseService';

export const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setFeedback('Enter a valid telemetry email address.');
      return;
    }

    setStatus('submitting');
    setFeedback(null);

    try {
      const result = await subscribeToNewsletter(trimmed);
      setStatus('success');
      setEmail('');
      setFeedback(
        result.alreadySubscribed
          ? 'NODE VERIFIED // Already registered for ZYNIQ dispatches.'
          : 'DISPATCH LINK ESTABLISHED // Subscribed to sovereign updates.'
      );
      setTimeout(() => {
        setStatus('idle');
        setFeedback(null);
      }, 5000);
    } catch {
      setStatus('error');
      setFeedback('Transmission interrupted. Please retry.');
    }
  };

  return (
    <div className="w-full py-8 mb-8 border-b border-[#E5E5E5] dark:border-[#1A1A1A]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Minimalist Editorial Copy */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#34A499]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A499] animate-pulse" />
            <span>DISPATCH SYNDICATION // DIRECT TELEMETRY</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
            Receive Sovereign Research Dispatches
          </h3>
          <p className="text-xs text-[#666666] dark:text-[#888888] font-mono leading-relaxed">
            Zero-noise architectural briefs on synthetic intelligence, edge silicon, and cognitive systems.
          </p>
        </div>

        {/* Right: Minimalist Email Input Field */}
        <div className="w-full lg:w-auto lg:min-w-[400px]">
          <form onSubmit={handleSubmit} noValidate className="relative">
            <div
              className={`flex items-center bg-[#FAFAFA] dark:bg-[#0B0B0B] border transition-colors rounded-lg overflow-hidden ${
                status === 'error'
                  ? 'border-red-500/80'
                  : status === 'success'
                  ? 'border-[#34A499]'
                  : 'border-[#E5E5E5] dark:border-[#222222] focus-within:border-[#34A499] dark:focus-within:border-[#34A499]'
              }`}
            >
              <div className="pl-3.5 pr-2 text-[#777777] dark:text-[#555555] flex items-center pointer-events-none">
                <Terminal className="w-3.5 h-3.5 text-[#34A499]" />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setFeedback(null);
                  }
                }}
                disabled={status === 'submitting'}
                placeholder="architect@domain.io"
                aria-label="Email address for dispatch updates"
                className="w-full py-2.5 pr-3 bg-transparent text-xs font-mono text-[#1A1A1A] dark:text-white placeholder-[#888888] dark:placeholder-[#555555] focus:outline-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="shrink-0 m-1 px-4 py-2 bg-[#1A1A1A] hover:bg-[#34A499] dark:bg-[#34A499] dark:hover:bg-[#2B8A80] text-white text-[11px] font-mono uppercase tracking-wider font-semibold rounded-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span>SYNCING...</span>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </>
                ) : (
                  <>
                    <span>SUBSCRIBE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Minimalist Telemetry Status Line */}
            <div className="mt-2 min-h-[16px] flex items-center justify-between text-[10px] font-mono">
              {feedback ? (
                <span
                  className={
                    status === 'error'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-[#34A499] font-medium'
                  }
                >
                  {feedback}
                </span>
              ) : (
                <span className="text-[#777777] dark:text-[#555555]">
                  ENCRYPTED CADENCE · UNSUBSCRIBE ANYTIME
                </span>
              )}
              <span className="text-[#888888] dark:text-[#444444] hidden sm:inline">
                PROTO // ZYNIQ-2026
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
