import Button from '../ui/Button.jsx';
import { images } from '../../assets/landingImages.js';

export default function FinalCTA({ onLaunchSenior, onRequestCaregiver }) {
  return (
    <section className="py-24 lg:py-32 bg-brand-teal text-brand-ivory relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20">
          <img alt="SMRITI emblem" className="w-full h-full object-contain" src={images.logoEmblem} />
        </div>
        <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
          Make technology feel a little <em className="italic font-light text-brand-amberSubtle">more human</em>.
        </h2>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Experience SMRITI for your elderly family members or register your healthcare center for pilot deployment
          in Meghalaya and Assam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="inverse" size="lg" className="w-full sm:w-auto" onClick={onLaunchSenior}>
            Launch SMRITI Tablet Mode
          </Button>
          <Button variant="inverseOutline" size="lg" className="w-full sm:w-auto" onClick={onRequestCaregiver}>
            Request Caregiver Access
          </Button>
        </div>

        <div className="pt-8 text-xs text-white/60">
          Built with respect for human dignity • Smart India Hackathon Finalist Initiative
        </div>
      </div>

      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-tealLight/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-amber/20 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
