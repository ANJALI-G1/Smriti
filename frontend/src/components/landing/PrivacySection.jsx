const POINTS = [
  { title: 'On-Device Cryptography', text: 'Family voice records and personal photographs remain encrypted on local device storage.' },
  { title: 'Zero Commercial Tracking', text: 'No advertising identifiers, no third-party cookies, and no corporate profile harvesting.' },
  { title: 'Family-First Consent', text: 'Only explicitly invited daughters, sons, and designated ASHA nurses can receive weekly summaries.' },
];

export default function PrivacySection() {
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase font-semibold tracking-widest text-brand-amber">Data Sovereignty</span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal">Your memories belong only to you.</h2>
        <p className="text-brand-slate text-base max-w-2xl mx-auto leading-relaxed">
          In an era where personal data is constantly commercialized, SMRITI treats personal and family memories as
          sacred trust. We believe cognitive health data should never be monetized, tracked, or shared with
          third-party brokers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          {POINTS.map((point) => (
            <div key={point.title} className="p-5 rounded-xl bg-brand-surface/50 border border-brand-border">
              <h4 className="font-semibold text-brand-teal text-sm">{point.title}</h4>
              <p className="text-xs text-brand-slate mt-2">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
