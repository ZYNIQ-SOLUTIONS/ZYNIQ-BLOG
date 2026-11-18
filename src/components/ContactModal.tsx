import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { submitContactInquiry } from '../services/supabaseService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [department, setDepartment] = useState('ZYNIQ Solutions');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        department,
        name,
        email,
        message,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0D0D0D] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-white dark:bg-[#121212] border-b border-[#E5E5E5] dark:border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A499]" />
            <h3 className="font-display text-base font-bold text-[#1A1A1A] dark:text-white">
              Initiate Direct Consultation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#34A499] mx-auto animate-bounce" />
            <h4 className="font-display text-xl font-bold text-[#1A1A1A] dark:text-white">
              Transmission Logged
            </h4>
            <p className="text-xs font-mono text-[#666666] dark:text-[#AAAAAA] max-w-sm mx-auto leading-relaxed">
              Your architectural inquiry has been routed to the {department} systems lead. You will receive an encrypted dispatch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
              Engage directly with ZYNIQ research architects across sovereign compute, hardware engineering, and industrial intelligence.
            </p>

            <div>
              <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1">
                Target Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#34A499]"
              >
                <option value="ZYNIQ Solutions">ZYNIQ Solutions (Enterprise Systems & Autonomy)</option>
                <option value="ZYNIQ Studio">ZYNIQ Studio (Industrial Design & Hardware)</option>
                <option value="ZYNIQ Core">ZYNIQ Core (Low-Latency Neural Silicon)</option>
                <option value="ZYNIQ Cloud">ZYNIQ Cloud (Sovereign Micro-Datacenters)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1">
                  Full Name / Call Sign
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Julian Thorne"
                  className="w-full bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#34A499]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1">
                  Work / Encrypted Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thorne@organization.com"
                  className="w-full bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#34A499]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1">
                Technical Scope / Requirements
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify compute bounds, latency targets, and physical deployment constraints..."
                className="w-full bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white p-3.5 rounded-xl focus:outline-none focus:border-[#34A499] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-[10px] font-mono text-[#777777] dark:text-[#666666]">
                Response SLA: &lt; 24h
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Transmit Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
