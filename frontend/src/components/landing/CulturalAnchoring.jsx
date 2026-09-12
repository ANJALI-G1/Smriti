import { images } from '../../assets/landingImages.js';

export default function CulturalAnchoring() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-brand-border" id="cultural-memory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-brand-teal">Indigenous Resonance</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal leading-tight">
              Memories feel different when they feel like home.
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Cognitive scaffolding cannot be imported from Silicon Valley or translated generically. SMRITI is
              anchored in the cultural landscape of North-East India — honoring Khasi matrilineal family structures,
              Assamese harvest rhythms, regional bamboo craftsmanship, and communal storytelling.
            </p>
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-border">
                <span className="font-semibold text-sm text-brand-teal block">Linguistic Naturalness</span>
                <p className="text-xs text-brand-slate mt-1">
                  Native Khasi and Assamese dialects, speech cadences, and honorific forms (e.g. Mei, Bah, Kong).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-border">
                <span className="font-semibold text-sm text-brand-amber block">Sensory &amp; Seasonal Rituals</span>
                <p className="text-xs text-brand-slate mt-1">
                  Recognizing autumn harvest (Wangala, Chapchar Kut, Bihu) and daily rituals like afternoon red tea
                  (Sha Saw).
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-elevated">
              <img
                alt="Pine hill morning veranda with blooming orchids"
                className="w-full aspect-[16/10] object-cover"
                src={images.verandaHills}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent flex items-end p-8">
                <div className="text-white max-w-lg">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-amberSubtle">
                    Meghalaya Veranda Grounding
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal mt-1">
                    “The smell of wet pine, morning fog over the hills, and orchid blooms on the railing are sacred
                    memory markers.”
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
