import { images } from '../../assets/landingImages.js';

const SeniorScreen = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-editorial text-2xl text-brand-charcoal">Kumno, Aiton! (Good Morning)</h4>
        <p className="text-sm text-brand-slate">Today is a clear Wednesday in Upper Shillong.</p>
      </div>
      <div className="text-right">
        <span className="font-serif text-3xl font-light text-brand-teal">9:15</span>
        <span className="text-xs text-brand-slate block">AM</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      <div className="bg-white p-5 rounded-xl border border-brand-border shadow-sm hover:border-brand-teal transition-all">
        <div className="w-10 h-10 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center font-bold mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeWidth="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h5 className="font-semibold text-brand-charcoal text-base">My People</h5>
        <p className="text-xs text-brand-slate mt-1">Photos &amp; voices of Rina, Ban, and family.</p>
      </div>
      <div className="bg-white p-5 rounded-xl border border-brand-border shadow-sm hover:border-brand-teal transition-all">
        <div className="w-10 h-10 rounded-full bg-brand-amberSubtle text-brand-amber flex items-center justify-center font-bold mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h5 className="font-semibold text-brand-charcoal text-base">My Morning</h5>
        <p className="text-xs text-brand-slate mt-1">Veranda sun, tea ritual, and orchard walk.</p>
      </div>
      <div className="bg-white p-5 rounded-xl border border-brand-border shadow-sm hover:border-brand-teal transition-all">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </div>
        <h5 className="font-semibold text-brand-charcoal text-base">Talk with SMRITI</h5>
        <p className="text-xs text-brand-slate mt-1">Just speak in Khasi or Assamese.</p>
      </div>
    </div>

    <div className="pt-4 flex justify-center">
      <button
        type="button"
        className="px-8 py-4 bg-brand-teal hover:bg-brand-tealDark text-white rounded-full shadow-md flex items-center gap-3 transition-transform hover:scale-105"
      >
        <svg className="w-6 h-6 text-brand-amber" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
        <span className="text-sm font-semibold tracking-wide">Press and speak: “Who is visiting this evening?”</span>
      </button>
    </div>
  </div>
);

const CaregiverScreen = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between pb-3 border-b border-brand-border">
      <div>
        <h4 className="font-editorial text-xl font-bold text-brand-charcoal">Caregiver Console • Ban K.</h4>
        <p className="text-xs text-brand-slate">Managing cognitive routine for Aiton (Father-in-law)</p>
      </div>
      <span className="text-xs px-2.5 py-1 bg-brand-tealSubtle text-brand-teal rounded font-medium">Synced 10m ago</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-white border border-brand-border">
        <span className="text-xs text-brand-muted block uppercase font-medium">Morning Activity</span>
        <p className="text-sm font-semibold text-brand-charcoal mt-1">9:15 AM • Audio prompt of Rina played</p>
        <p className="text-xs text-emerald-700 mt-1">Response: Joyful recognition in 4 seconds</p>
      </div>
      <div className="p-4 rounded-xl bg-white border border-brand-border">
        <span className="text-xs text-brand-muted block uppercase font-medium">Evening Prompt</span>
        <p className="text-sm font-semibold text-brand-charcoal mt-1">5:30 PM • Sunset Veranda Routine</p>
        <p className="text-xs text-brand-slate mt-1">Status: Scheduled to auto-play on living room tablet</p>
      </div>
    </div>

    <div className="p-3 bg-brand-amberSubtle rounded-lg border border-brand-amber/30 text-xs text-brand-charcoal flex items-center justify-between gap-3">
      <span>Ready to add a new memory photo or voice greeting?</span>
      <button
        type="button"
        className="px-3 py-1.5 bg-brand-amber text-white rounded font-medium hover:bg-brand-amberLight transition-colors shrink-0"
      >
        Add Moment
      </button>
    </div>
  </div>
);

export default function DualGateway({ mode, onModeChange, onEnterCaregiver, onEnterPatient }) {
  return (
    <section id="gateway-experience" className="py-20 lg:py-28 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase font-semibold tracking-widest text-brand-amber">Interactive Access Portal</p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-brand-teal mt-2">Where would you like to enter?</h2>
          <p className="text-brand-slate text-sm sm:text-base mt-3">
            SMRITI seamlessly bifurcates between a zero-barrier experience for seniors and an actionable dashboard for
            family caregivers and field workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onModeChange('senior')}
            onKeyDown={(e) => e.key === 'Enter' && onModeChange('senior')}
            className={`text-left relative rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 shadow-soft hover:shadow-elevated flex flex-col justify-between ${
              mode === 'senior' ? 'border-brand-teal/80 bg-brand-ivory' : 'border-brand-border bg-white'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-brand-tealSubtle text-brand-teal font-medium text-xs">
                  For Loved Ones
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-brand-charcoal">Elderly Companion Mode</h3>
              <p className="text-sm text-brand-slate leading-relaxed">
                One-tap direct tablet interface. No passwords, no confusing menus. High-contrast typography, large
                touch targets, and voice in native Khasi, Assamese, or English.
              </p>
              <div className="pt-4 flex items-center gap-3 border-t border-brand-border">
                <img
                  alt="Aiton portrait"
                  className="w-12 h-12 rounded-full object-cover border border-brand-teal/20"
                  src={images.aitonPortrait}
                />
                <div>
                  <div className="text-sm font-semibold text-brand-charcoal">Aiton (74 years)</div>
                  <div className="text-xs text-brand-slate">Upper Shillong, Meghalaya • Living room tablet</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterPatient();
                }}
                className="w-full py-3.5 px-4 bg-brand-teal text-brand-ivory rounded-lg text-sm font-medium hover:bg-brand-tealDark transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Tablet Simulation</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onModeChange('caregiver')}
            onKeyDown={(e) => e.key === 'Enter' && onModeChange('caregiver')}
            className={`text-left relative rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 shadow-soft hover:shadow-elevated flex flex-col justify-between ${
              mode === 'caregiver' ? 'border-brand-amber/80 bg-brand-amberSubtle/20' : 'border-brand-border bg-white'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-brand-amberSubtle text-brand-amber font-medium text-xs">
                  For Families &amp; ASHA
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-brand-charcoal">Caregiver Intelligence</h3>
              <p className="text-sm text-brand-slate leading-relaxed">
                Add memory moments, schedule family voice reminders, and review peaceful cognitive trend logs without
                invasive surveillance or anxiety-inducing clinical scores.
              </p>
              <div className="pt-4 flex items-center gap-3 border-t border-brand-border">
                <div className="w-12 h-12 rounded-full bg-brand-amberSubtle flex items-center justify-center text-brand-amber font-bold text-sm">
                  BK
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-charcoal">Ban (Daughter-in-law)</div>
                  <div className="text-xs text-brand-slate">Managing care routine for Aiton • Phone Linked</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterCaregiver();
                }}
                className="w-full py-3.5 px-4 bg-brand-surface text-brand-charcoal border border-brand-borderDark hover:bg-brand-amberSubtle hover:text-brand-amber rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>View Caregiver Console</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-brand-border bg-brand-ivory p-6 sm:p-8 shadow-inner transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between pb-6 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded text-white uppercase tracking-wider ${
                  mode === 'caregiver' ? 'bg-brand-amber' : 'bg-brand-teal'
                }`}
              >
                {mode === 'caregiver' ? 'Caregiver Brief' : 'Companion Screen'}
              </span>
              <span className="text-xs text-brand-slate">Simulating: 10.5" Living Room Tablet (Upper Shillong)</span>
            </div>
            <span className="text-xs font-mono text-brand-muted">Hill Mode: Ready</span>
          </div>

          <div className="py-6">{mode === 'caregiver' ? <CaregiverScreen /> : <SeniorScreen />}</div>
        </div>
      </div>
    </section>
  );
}
