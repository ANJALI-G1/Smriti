import { images } from '../../assets/landingImages.js';

const SECTION_LINKS = [
  { label: 'Living Room Tablet', href: '#how-it-works' },
  { label: 'Caregiver Portal', href: '#gateway-experience' },
  { label: 'Hill Mode (Offline)', href: '#offline-first' },
  { label: 'Khasi & Assamese Voice', href: '#cultural-memory' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-border">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img alt="SMRITI logo" className="w-8 h-8 object-contain" src={images.logoEmblem} />
              <span className="font-editorial text-2xl font-bold text-brand-teal tracking-wide">SMRITI</span>
            </div>
            <p className="text-xs text-brand-slate max-w-sm leading-relaxed">
              System for Memory, Recall, Interaction, Training and Independence. An indigenous, offline-first
              assistive cognitive companion honoring elders across North-East India.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal mb-3">Sections</h4>
            <ul className="space-y-2 text-xs text-brand-slate">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="hover:text-brand-teal" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal mb-3">
              Field Deployment
            </h4>
            <p className="text-xs text-brand-slate leading-relaxed">
              Co-tested with community health workers in Shillong, Cherrapunji, Guwahati, and rural Meghalaya
              districts.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <span>© 2025 SMRITI Cognitive Care Initiative. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a className="hover:text-brand-teal" href="#">Privacy Principles</a>
            <a className="hover:text-brand-teal" href="#">Terms of Dignity</a>
            <a className="hover:text-brand-teal" href="#">Offline Protocol</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
