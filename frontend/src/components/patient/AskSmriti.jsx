import Icon from '../ui/Icon.jsx';
import { voicePrompts } from '../../data/patientMock.js';

export default function AskSmriti({ onShowToast }) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 w-full py-16 text-center">
      <div className="bg-brand-surface rounded-3xl p-8 sm:p-10 flex flex-col items-center relative overflow-hidden shadow-sm">
        <div className="absolute w-72 h-72 rounded-full bg-brand-amberSubtle blur-3xl -top-16 -right-16 pointer-events-none" />
        <div className="absolute w-72 h-72 rounded-full bg-brand-tealSubtle blur-3xl -bottom-16 -left-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs uppercase text-brand-amber tracking-widest font-semibold mb-2">Need something?</span>
          <h3 className="font-serif text-2xl text-brand-teal mb-6">Ask SMRITI</h3>

          <button
            type="button"
            aria-label="Speak to SMRITI"
            onClick={() => onShowToast('Listening… (voice assistant is a demo preview for now)')}
            className="relative w-24 h-24 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all mb-6"
          >
            <span className="absolute inset-0 rounded-full bg-brand-teal/10 animate-ping" />
            <Icon name="mic" className="w-9 h-9" />
          </button>

          <p className="font-elderly text-lg text-brand-charcoal mb-8">
            Touch the button and speak in Khasi, Assamese, or English.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {voicePrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onShowToast(`SMRITI: hearing ${prompt.label} — coming soon in this demo.`)}
                className="px-5 py-3 rounded-full bg-white text-brand-charcoal font-elderly text-base shadow-sm hover:bg-brand-tealSubtle transition-colors flex items-center gap-2"
              >
                <Icon name={prompt.icon} className="w-4 h-4 text-brand-amber" />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
