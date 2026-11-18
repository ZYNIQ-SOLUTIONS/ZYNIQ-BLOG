import React, { useState } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  Server,
  Key,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  generateSupabaseSQLSchema
} from '../services/supabaseService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.supabaseUrl);
  const [anonKey, setAnonKey] = useState(currentConfig.supabaseAnonKey);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsTesting(true);
    setStatusMessage('Connecting to Supabase...');
    setTimeout(() => {
      const updated = saveSupabaseConfig({
        supabaseUrl: url.trim(),
        supabaseAnonKey: anonKey.trim(),
      });
      setIsTesting(false);
      if (updated.isConnected) {
        setStatusMessage('Supabase connection active! Data will synchronize directly.');
      } else {
        setStatusMessage('Operating in offline-first mode with persistent Node.js/local storage.');
      }
      if (onSyncComplete) onSyncComplete();
    }, 600);
  };

  const handleCopySQL = () => {
    const sql = generateSupabaseSQLSchema();
    navigator.clipboard.writeText(sql);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F0F0F] border border-[#E5E5E5] dark:border-[#262626] rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#00c584] dark:text-[#00E599]" />
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white">
                Supabase Backend & Data Sync
              </h2>
              <p className="text-[11px] font-mono text-[#666666] dark:text-[#777777]">
                NODE.JS + SUPABASE PERSISTENCE ENGINE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#242424] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  currentConfig.isConnected ? 'bg-[#00c584] dark:bg-[#00E599] shadow-sm' : 'bg-[#34A499]'
                }`}
              />
              <div>
                <p className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-white uppercase">
                  {currentConfig.isConnected
                    ? 'Connected to Supabase Cloud Instance'
                    : 'Offline-First Mode Active (Zero-Blocker Fallback)'}
                </p>
                <p className="text-[11px] text-[#555555] dark:text-[#888888]">
                  {currentConfig.isConnected
                    ? 'All posts, comments, and real-time edits sync directly to your Postgres database.'
                    : 'The app works out of the box with zero setup. You can attach a Supabase project at any time.'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#00c584] dark:text-[#00E599]" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#282828] focus:border-[#00c584] text-xs font-mono text-[#1A1A1A] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#555555] dark:text-[#AAAAAA] uppercase mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#00c584] dark:text-[#00E599]" />
                <span>Supabase Anon / Public Key</span>
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#282828] focus:border-[#00c584] text-xs font-mono text-[#1A1A1A] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-none"
              />
            </div>

            {statusMessage && (
              <p className="text-xs font-mono text-[#00875a] dark:text-[#00E599] bg-[#00E599]/10 p-2.5 rounded-lg border border-[#00E599]/20">
                {statusMessage}
              </p>
            )}
          </div>

          {/* One-Click SQL Migration */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#141414] border border-[#E5E5E7] dark:border-[#242424] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#444444] dark:text-[#AAAAAA] uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00c584] dark:text-[#00E599]" />
                <span>One-Click Supabase DDL SQL Schema</span>
              </span>
              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#111111] hover:bg-black dark:bg-[#222222] dark:hover:bg-[#333333] text-white text-xs font-mono rounded-lg transition-colors"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#666666] dark:text-[#777777]">
              Copy and execute in your Supabase SQL Editor to provision the <code>zyniq_posts</code> and <code>zyniq_comments</code> tables with Row Level Security (RLS).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F9F9FB] dark:bg-[#141414] border-t border-[#E5E5E7] dark:border-[#222222] flex items-center justify-between">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-[#666666] dark:text-[#777777] hover:text-[#00c584] dark:hover:text-[#00E599] transition-colors"
          >
            <span>Supabase Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isTesting}
              className="px-5 py-2 text-xs font-mono font-bold bg-[#00c584] hover:bg-[#00b075] dark:bg-[#00E599] dark:hover:bg-[#00c584] text-white dark:text-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Save & Connect</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
