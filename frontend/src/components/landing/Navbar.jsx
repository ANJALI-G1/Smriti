import Button from '../ui/Button.jsx';
import { images } from '../../assets/landingImages.js';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Dual Gateway', href: '#gateway-experience' },
  { label: 'Personal Memory AI', href: '#personal-memory' },
  { label: 'Hill Mode (Offline)', href: '#offline-first' },
  { label: 'Cultural Anchoring', href: '#cultural-memory' },
  { label: 'Caregiver Briefs', href: '#caregiver-mode' },
];

export default function Navbar({ onNavigateCaregiver }) {
  return (
    <header className="sticky top-0 z-50 bg-brand-ivory/90 backdrop-blur-md border-b border-brand-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a className="flex items-center gap-3.5 group" href="#">
          <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-white/60 border border-brand-border shadow-sm group-hover:border-brand-teal/40 transition-colors">
            <img alt="SMRITI logo emblem" className="w-full h-full object-contain" src={images.logoEmblem} />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-2xl font-semibold tracking-wide text-brand-teal leading-none">
              SMRITI
            </span>
            <span className="text-[10px] tracking-widest uppercase font-medium text-brand-slate/80 mt-1">
              Cognitive Memory Tech
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-brand-slate">
          {NAV_LINKS.map((link) => (
            <a key={link.href} className="hover:text-brand-teal transition-colors" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="hidden sm:inline-flex text-xs uppercase tracking-wider font-semibold text-brand-teal hover:text-brand-tealDark px-4 py-2.5 rounded-md hover:bg-brand-surface transition-colors"
            onClick={onNavigateCaregiver}
          >
            ASHA / Care Portal
          </button>
          <Button as="a" href="#gateway-experience" variant="primary" size="md">
            <span>Enter SMRITI</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
