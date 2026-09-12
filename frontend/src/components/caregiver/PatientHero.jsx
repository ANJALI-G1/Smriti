import { images } from '../../assets/landingImages.js';

export default function PatientHero({ patient, caregiverName }) {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-tealSubtle/60 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amberSubtle border border-brand-amber/20 text-brand-amber text-xs font-semibold">
              <span>{patient.location}</span>
              <span>•</span>
              <span>Khasi &amp; Assamese Mesh Active</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal font-normal tracking-tight">
              Good morning, <span className="text-brand-teal font-medium">{caregiverName}</span>.
            </h1>
            <p className="font-editorial text-xl text-brand-slate italic">
              Here is how {patient.name} is doing today.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-border">
            <div className="relative shrink-0">
              <img
                src={images.aitonPortrait}
                alt={`${patient.name} portrait`}
                className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl object-cover shadow-sm ring-2 ring-white"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-brand-positive text-white text-[10px] font-bold shadow-sm">
                Active
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-charcoal">{patient.name}</h2>
                <span className="text-xs text-brand-slate">{patient.age} years</span>
              </div>
              <p className="text-xs text-brand-slate mt-0.5">{patient.relationship} · Home Companion</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-positive">
                  <span className="w-2 h-2 rounded-full bg-brand-positive animate-ping" />
                  {patient.statusNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
