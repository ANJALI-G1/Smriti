import { useState } from 'react';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-brand-teal shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    />
  </svg>
);

export default function OfflineFirst() {
  const [isOffline, setIsOffline] = useState(true);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6EE] border-b border-brand-border" id="offline-first">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-brand-amber">
              Resilient Hill Infrastructure
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-brand-teal leading-tight">
              Designed for places where the internet isn’t guaranteed.
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              In remote districts of Meghalaya, Assam, and Nagaland, mountain rain and erratic connectivity disrupt
              typical cloud apps. SMRITI runs completely on-device using local storage and local lightweight neural
              speech.
            </p>
            <ul className="space-y-3 text-sm text-brand-charcoal">
              <li className="flex items-center gap-3">
                <CheckIcon />
                <span>
                  <strong>Zero-latency interaction:</strong> Audio prompts load instantly without waiting for mobile
                  towers.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon />
                <span>
                  <strong>Self-contained on-device ledger:</strong> Daily memory interactions stay secure on the
                  tablet.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon />
                <span>
                  <strong>Asynchronous sync:</strong> Silently syncs summary wellness notes with ASHA or family when
                  signal returns.
                </span>
              </li>
            </ul>

            <div className="p-4 rounded-xl bg-white border border-brand-border flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs font-semibold text-brand-charcoal block">Interactive Hill-Mode Toggle</span>
                <span className={`text-xs font-medium ${isOffline ? 'text-brand-teal' : 'text-emerald-600'}`}>
                  {isOffline
                    ? 'Currently: Full Meghalaya Hill Mode (Simulating Zero Connectivity)'
                    : 'Currently: Wi-Fi Connected (Syncing Pending Ledger Deltas)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOffline((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-brand-teal text-white hover:bg-brand-tealDark transition-colors"
              >
                Toggle Online/Offline
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      isOffline ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-xs font-mono uppercase font-semibold text-brand-teal">
                    {isOffline ? 'Local-First Vault: Active' : 'Cloud Ledger Synchronized'}
                  </span>
                </div>
                <span className="text-xs text-brand-muted">Hardware: Low-cost 3GB Android</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-lg bg-brand-surface/70 border border-brand-border flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-amber">●</span>
                    <span className="text-brand-charcoal">IndexedDB On-Device Ledger</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Persistent Offline</span>
                </div>
                <div className="text-center text-brand-muted text-xs">↓ zero dependency on 4G/5G towers ↓</div>
                <div className="p-3.5 rounded-lg bg-brand-surface/70 border border-brand-border flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-teal">●</span>
                    <span className="text-brand-charcoal">Voice Scaffolding Engine</span>
                  </div>
                  <span className="text-brand-teal bg-brand-tealSubtle px-2 py-0.5 rounded">Cached Audio Cache</span>
                </div>
                <div className="text-center text-brand-muted text-xs">↓ when family visits or Wi-Fi returns ↓</div>
                <div className="p-3.5 rounded-lg bg-brand-surface/70 border border-brand-border flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">●</span>
                    <span className="text-brand-charcoal">Encrypted Asynchronous Delta Sync</span>
                  </div>
                  <span className="text-brand-charcoal bg-gray-100 px-2 py-0.5 rounded">
                    {isOffline ? 'Buffered Queue: 0 Pending' : 'Buffered Queue: Syncing…'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-amberSubtle/50 border border-brand-amber/20 text-xs text-brand-charcoal">
                <span className="font-bold text-brand-amber block mb-1">Guaranteed Continuity</span>
                Even if electricity or internet drops for 14 days during monsoon landslides, morning greetings,
                family albums, and daily voice reminders continue without interruption.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
