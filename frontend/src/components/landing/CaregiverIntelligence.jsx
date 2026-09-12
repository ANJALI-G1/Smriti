import { images } from '../../assets/landingImages.js';

const STATS = [
  { label: 'Family Recognition', value: '96%', valueClass: 'text-brand-teal', note: 'High & consistent recall', noteClass: 'text-emerald-600' },
  { label: 'Routine Adherence', value: '88%', valueClass: 'text-brand-charcoal', note: 'Ginger tea & morning walk', noteClass: 'text-brand-slate' },
  { label: 'Emotional Calm', value: 'Steady', valueClass: 'text-brand-amber', note: 'No agitation detected', noteClass: 'text-brand-slate' },
  { label: 'Voice Interactions', value: '14 / day', valueClass: 'text-brand-charcoal', note: 'Assamese & Khasi prompts', noteClass: 'text-brand-slate' },
];

export default function CaregiverIntelligence() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-brand-border" id="caregiver-mode">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-brand-teal">Dignified Monitoring</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal mt-2 leading-tight">
            Caregiving shouldn&apos;t mean guessing.
          </h2>
          <p className="text-brand-slate text-base mt-3">
            SMRITI translates subtle daily interactions into gentle, actionable insights — keeping families and
            healthcare workers informed without stigmatizing medical alarms.
          </p>
        </div>

        <div className="bg-brand-surface/40 border border-brand-border rounded-2xl p-6 sm:p-8 shadow-soft max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
            <div className="flex items-center gap-4">
              <img
                alt="Aiton portrait"
                className="w-14 h-14 rounded-full object-cover border-2 border-brand-teal"
                src={images.aitonPortrait}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl font-bold text-brand-charcoal">Aiton</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                    Active &amp; Calm Today
                  </span>
                </div>
                <p className="text-xs text-brand-slate mt-0.5">
                  Linked Tablet: Living Room • Upper Shillong • Primary Caregiver: Ban K.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-brand-muted block">Weekly Care Brief</span>
              <span className="text-xs font-semibold text-brand-teal">Dec 4 – Dec 11 • All Calm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-xl border border-brand-border">
                <div className="text-xs text-brand-muted uppercase font-medium tracking-wide">{stat.label}</div>
                <div className={`font-serif text-2xl font-bold mt-1 ${stat.valueClass}`}>{stat.value}</div>
                <div className={`text-xs font-medium mt-1 ${stat.noteClass}`}>{stat.note}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-xl border border-brand-border flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-brand-amberSubtle text-brand-amber flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-amber">
                Gentle Clinical Observation (Non-Stigmatizing)
              </span>
              <p className="text-sm text-brand-charcoal leading-relaxed">
                Word recall hesitations have slightly increased during the late evening tea hour over the past two
                weeks. Morning recall remains vibrant and sharp. Consider gently bringing this subtle rhythm note to
                the upcoming ASHA community health visit.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-slate">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Next Family Event:</span>
              <span className="font-semibold text-brand-charcoal">Rina’s Weekend Orchard Visit (Saturday)</span>
            </div>
            <button type="button" className="text-brand-teal hover:underline font-semibold flex items-center gap-1">
              <span>Add New Voice Note or Photo Moment</span>
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
