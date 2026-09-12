import { images } from '../../assets/landingImages.js';

const WAVE_WIDTHS = [
  'bg-brand-teal/40',
  'bg-brand-teal/60',
  'bg-brand-teal',
  'bg-brand-amber',
  'bg-brand-teal',
  'bg-brand-teal/60',
  'bg-brand-teal/40',
];

export default function VoiceInteraction() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF6EE] border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-brand-amber">Voice as Pure Touch</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-brand-teal mt-2">Just speak. No typing, ever.</h2>
          <p className="text-brand-slate text-base mt-3">
            For hands stiffened by arthritis or eyes fatigued by small screens, SMRITI listens with serene patience.
            It speaks with warmth, regional inflection, and familiarity.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-brand-border p-6 sm:p-10 shadow-soft">
          <div className="flex items-center justify-center gap-1.5 h-14 mb-8">
            {WAVE_WIDTHS.map((color, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={i} className={`w-1.5 rounded-full wave-bar ${color}`} />
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img alt="Aiton portrait" className="w-10 h-10 rounded-full object-cover shrink-0 border border-brand-border" src={images.aitonPortrait} />
              <div className="bg-brand-surface p-4 rounded-2xl rounded-tl-none max-w-lg text-sm text-brand-charcoal">
                <span className="text-[11px] font-semibold text-brand-slate block mb-1">Aiton</span>
                “Who is this visiting today? I hear laughing outside.”
              </div>
            </div>

            <div className="flex items-start justify-end gap-4">
              <div className="bg-brand-teal text-brand-ivory p-4 rounded-2xl rounded-tr-none max-w-lg text-sm">
                <div className="flex items-center justify-between text-[11px] text-brand-amberSubtle font-medium mb-1">
                  <span>SMRITI Companion</span>
                  <span className="text-[10px] font-mono">Audio Prompt</span>
                </div>
                “That is Rina, your granddaughter. She is wearing her warm mustard cardigan and carrying fresh apples
                from the orchard.”
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 font-serif font-bold text-xs">
                S
              </div>
            </div>

            <div className="flex items-start gap-4">
              <img alt="Aiton portrait" className="w-10 h-10 rounded-full object-cover shrink-0 border border-brand-border" src={images.aitonPortrait} />
              <div className="bg-brand-surface p-4 rounded-2xl rounded-tl-none max-w-lg text-sm text-brand-charcoal">
                <span className="text-[11px] font-semibold text-brand-slate block mb-1">Aiton</span>
                “I felt a little worried this morning.”
              </div>
            </div>

            <div className="flex items-start justify-end gap-4">
              <div className="bg-brand-teal text-brand-ivory p-4 rounded-2xl rounded-tr-none max-w-lg text-sm">
                <div className="flex items-center justify-between text-[11px] text-brand-amberSubtle font-medium mb-1">
                  <span>SMRITI Companion</span>
                  <span className="text-[10px] font-mono">Sensory Grounding</span>
                </div>
                “You are safe at home in Upper Shillong. Your warm ginger tea is ready on the wooden veranda, and the
                orchids are blooming in the sunlight.”
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 font-serif font-bold text-xs">
                S
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
