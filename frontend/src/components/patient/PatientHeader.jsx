import { images } from '../../assets/landingImages.js';
import Icon from '../ui/Icon.jsx';

export default function PatientHeader({ patientName, isAuthenticated, onLogout, onShowToast }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-brand-ivory/90 backdrop-blur-xl shadow-sm">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
              <path d="M12 6a6 6 0 1 1-6 6c0-2 1-3.5 2.5-4.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold text-brand-teal">SMRITI</span>
            <span className="text-[10px] text-brand-slate uppercase tracking-widest pt-1">My Memory Companion</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface text-brand-positive text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand-positive animate-pulse" />
            All caught up
          </div>

          <div className="flex items-center gap-2">
            <img src={images.aitonPortrait} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm" />
            <span className="font-elderly text-sm font-semibold text-brand-charcoal hidden xs:inline">
              {patientName} · 74
            </span>
          </div>

          <button
            type="button"
            aria-label="Voice assistant"
            onClick={() => onShowToast('Listening… (voice assistant is a demo preview for now)')}
            className="w-10 h-10 rounded-full bg-white text-brand-teal flex items-center justify-center shadow-sm hover:bg-brand-tealSubtle transition-all active:scale-95 shrink-0"
          >
            <Icon name="mic" className="w-5 h-5" />
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-semibold text-brand-slate hover:text-brand-teal underline underline-offset-2 shrink-0"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
