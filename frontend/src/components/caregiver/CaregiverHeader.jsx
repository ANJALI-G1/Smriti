import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../../assets/landingImages.js';

const STATUS_STYLES = {
  active: { dot: 'bg-brand-positive', badge: null },
  idle: { dot: 'bg-brand-muted', badge: null },
  attention: { dot: 'bg-brand-concern', badge: 'Needs attention' },
};

function PatientRow({ patient, isCurrent, onSelect }) {
  const style = STATUS_STYLES[patient.status] || STATUS_STYLES.idle;
  const initial = patient.name.charAt(0);

  if (isCurrent) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-tealSubtle border border-brand-teal/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={images.aitonPortrait} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${style.dot} ring-2 ring-white`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-brand-charcoal">{patient.name}</span>
              <span className="text-xs text-brand-slate">{patient.age}</span>
              <span className="text-[10px] font-medium text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded">
                Current
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-slate mt-0.5">
              <span>{patient.relationship}</span>
              <span>•</span>
              <span className="text-brand-positive font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-positive" /> {patient.statusNote}
              </span>
            </div>
          </div>
        </div>
        <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(patient)}
      className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-ivory border border-transparent hover:border-brand-border transition group"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center text-sm ${
            patient.status === 'attention' ? 'bg-brand-concernTint text-brand-concern' : 'bg-brand-tealSubtle text-brand-teal'
          }`}
        >
          {initial}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brand-charcoal group-hover:text-brand-teal">{patient.name}</span>
            <span className="text-xs text-brand-slate">{patient.age}</span>
            {style.badge && (
              <span className="text-[10px] font-semibold text-brand-concern bg-brand-concernTint px-1.5 py-0.5 rounded">
                {style.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-slate mt-0.5">
            <span>{patient.relationship}</span>
            <span>•</span>
            <span className={patient.status === 'attention' ? 'text-brand-concern' : ''}>{patient.statusNote}</span>
          </div>
        </div>
      </div>
      <span className="text-xs text-brand-slate group-hover:text-brand-teal">Switch →</span>
    </button>
  );
}

export default function CaregiverHeader({ patient, patients, caregiverName, onLogout, onShowToast }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchPatient = (target) => {
    setIsDropdownOpen(false);
    onShowToast(`Switching to ${target.name}'s dashboard isn't available in this demo yet — only Aiton has live data.`);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <a href="/caregiver" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
                <path d="M12 6a6 6 0 1 1-6 6c0-2 1-3.5 2.5-4.5" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-semibold tracking-tight text-brand-teal">SMRITI</span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-tealSubtle text-brand-teal uppercase">
                  Caregiver
                </span>
              </div>
              <p className="text-[11px] text-brand-slate">Personal Memory Companion</p>
            </div>
          </a>

          <div className="hidden sm:block h-7 w-px bg-brand-border" />

          <div className="relative min-w-0" ref={containerRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="flex items-center gap-3 py-1.5 px-2.5 rounded-xl border border-brand-border bg-white/70 hover:bg-white hover:border-brand-teal/40 hover:shadow-sm transition text-left group min-w-0"
            >
              <div className="relative shrink-0">
                <img src={images.aitonPortrait} alt={patient.name} className="w-9 h-9 rounded-full object-cover border border-brand-teal/20" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-positive ring-2 ring-white" />
              </div>
              <div className="pr-1 min-w-0 hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-brand-charcoal leading-none group-hover:text-brand-teal">
                    {patient.name}
                  </span>
                  <span className="text-xs text-brand-slate">{patient.age}</span>
                </div>
                <p className="text-[11px] text-brand-slate mt-0.5 leading-none truncate">{patient.relationship}</p>
              </div>
              <svg
                className={`w-4 h-4 text-brand-slate group-hover:text-brand-teal transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl border border-brand-border shadow-popover p-4 z-50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/60">
                  <span className="text-xs font-bold tracking-wider text-brand-slate uppercase">
                    My Patients ({patients.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => onShowToast('Guided onboarding for a new patient isn’t built yet in this demo.')}
                    className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add person
                  </button>
                </div>

                <div className="space-y-2">
                  {patients.map((p) => (
                    <PatientRow key={p.id} patient={p} isCurrent={p.id === patient.id} onSelect={handleSwitchPatient} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsOffline((v) => !v)}
            title="Click to test offline simulation"
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              isOffline
                ? 'bg-brand-amberSubtle text-brand-amber border-brand-amber/20 hover:bg-brand-amberSubtle/70'
                : 'bg-brand-positiveTint text-brand-positive border-brand-positive/20 hover:bg-brand-positiveTint/70'
            }`}
          >
            <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{isOffline ? 'Working offline · Stored safely on device' : 'Synced 8 min ago'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/patient')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-teal/20 text-brand-teal hover:bg-brand-tealSubtle text-xs font-semibold transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Switch to {patient.name}&apos;s Tablet View
          </button>

          <button
            type="button"
            title="1 new alert"
            onClick={() => onShowToast('Alerts: 1 pending amber alert (evening medicine missed at 7:30 PM).')}
            className="relative p-2 rounded-xl text-brand-slate hover:text-brand-teal hover:bg-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber ring-2 ring-brand-ivory" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-brand-border">
            <div className="w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white shrink-0">
              {caregiverName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-brand-charcoal leading-tight">{caregiverName}</p>
              <p className="text-[11px] text-brand-slate leading-tight">Caregiver</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-semibold text-brand-slate hover:text-brand-teal underline underline-offset-2 ml-1"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
