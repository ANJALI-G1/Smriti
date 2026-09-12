import { images } from '../../assets/landingImages.js';

const STEPS = [
  { color: 'bg-brand-teal', text: 'The Person: Aiton, 74, Shillong (Loves orchid veranda & tea)' },
  { color: 'bg-brand-teal', text: 'The Anchors: Granddaughter Rina’s laughter & morning walk' },
  { color: 'bg-brand-teal', text: 'Adaptive Neural Mesh: Recognizes pauses without grading or anxiety' },
  { color: 'bg-brand-amber', text: 'Peace of Mind for Caregivers across generations' },
];

export default function VisualStory() {
  return (
    <section className="py-20 lg:py-28 bg-brand-surface/40 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-brand-teal">
              The SMRITI Philosophy
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal leading-tight">
              SMRITI doesn’t test memory.
              <br />
              It gets to know <em className="italic text-brand-teal">the human</em>.
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Standard clinical tests treat cognitive changes with ticking timers and abstract numbers. SMRITI
              replaces clinical intimidation with warm cultural anchors: family trees, orchard harvests, familiar
              recipes, and regional speech patterns.
            </p>

            <div className="space-y-3.5 pt-2">
              {STEPS.map((step, i) => (
                <div key={step.text} className="flex items-center gap-3 text-sm font-medium text-brand-charcoal">
                  <span className={`w-6 h-6 rounded-full ${step.color} text-white flex items-center justify-center text-xs shrink-0`}>
                    {i + 1}
                  </span>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="p-4 rounded-xl bg-white border border-brand-border">
                <p className="text-xs text-brand-slate italic">
                  “When grandfather hesitated looking at a family portrait, SMRITI softly whispered: ‘Rina picked
                  those sweet apples with you.’ His whole face lit up.”
                </p>
                <span className="block text-[11px] font-semibold text-brand-teal mt-2">— Ban K., Shillong</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-brand-border shadow-soft bg-white">
                <img
                  alt="Aiton, 74, gentle grandfather in Meghalaya"
                  className="w-full aspect-square object-cover"
                  src={images.aitonPortrait}
                />
                <div className="p-3 bg-white">
                  <span className="text-xs font-semibold text-brand-charcoal block">Aiton, 74</span>
                  <span className="text-[11px] text-brand-slate">Upper Shillong • Gentle morning routine</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-brand-border shadow-soft bg-white">
                <img
                  alt="Misty pine hills and veranda home in Meghalaya"
                  className="w-full aspect-video object-cover"
                  src={images.verandaHills}
                />
                <div className="p-3 bg-white">
                  <span className="text-xs font-semibold text-brand-charcoal block">Veranda &amp; Pine Hills</span>
                  <span className="text-[11px] text-brand-slate">Sensory place-grounding cue</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden border border-brand-border shadow-soft bg-white">
                <img
                  alt="Rina in mustard cardigan in orchard"
                  className="w-full aspect-square object-cover"
                  src={images.rina}
                />
                <div className="p-3 bg-white">
                  <span className="text-xs font-semibold text-brand-charcoal block">Rina (Granddaughter)</span>
                  <span className="text-[11px] text-brand-slate">Favorite anchor: Apple harvest stories</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-brand-teal text-brand-ivory flex flex-col justify-between shadow-soft">
                <span className="text-xs uppercase tracking-wider text-brand-amber font-mono font-semibold">
                  Adaptive Engine
                </span>
                <p className="font-serif text-sm italic my-3 leading-relaxed">
                  “Memory isn’t just recalling facts; it is the feeling of belonging to people and places you
                  cherish.”
                </p>
                <span className="text-[11px] text-white/70">SMRITI Bi-directional Care Mesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
