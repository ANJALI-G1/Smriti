import { useMemo, useState } from 'react';
import { images } from '../../assets/landingImages.js';
import { resolveAssetUrl } from '../../api/client.js';
import Icon from '../ui/Icon.jsx';
import { RECALL_RESPONSES } from './memories/recallResponses.js';

// Fallback for names that predate real photo uploads — a caregiver-uploaded
// image (memory.imageUrl, resolved against the backend origin) always
// takes priority over these.
const KNOWN_IMAGES = {
  rina: images.rina,
  'wooden veranda garden': images.verandaHills,
};

function pickFeaturedMemory(memories) {
  if (!memories || memories.length === 0) return null;
  return memories.find((m) => m.type !== 'photo') || memories[0];
}

export default function MemoryOfTheDay({ status, memories = [] }) {
  const [feedback, setFeedback] = useState('');
  const memory = useMemo(() => pickFeaturedMemory(memories), [memories]);

  if (status === 'idle' || status === 'loading' || status === 'error' || !memory) {
    return null; // this section is a bonus extra — quietly absent rather than showing a placeholder card
  }

  const imageSrc =
    resolveAssetUrl(memory.imageUrl) ||
    resolveAssetUrl(memory.familyMemberPhotoUrl) ||
    KNOWN_IMAGES[memory.title?.toLowerCase()] ||
    KNOWN_IMAGES[memory.familyMemberName?.toLowerCase()];
  const audioSrc = memory.type === 'voice' ? resolveAssetUrl(memory.audioUrl) : null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 w-full py-16">
      <div className="bg-brand-tealSubtle rounded-3xl overflow-hidden shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 h-72 lg:h-auto relative bg-brand-surface">
            {imageSrc ? (
              <img src={imageSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-teal">
                <Icon name="heart" className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase text-brand-amber tracking-widest font-semibold block mb-2">
                {memory.title}
              </span>
              <h3 className="font-serif text-2xl text-brand-teal mb-3">Do you remember this?</h3>
              <p className="font-elderly text-lg text-brand-slate mb-8">
                {memory.description || 'A memory your family added for you.'}
              </p>
              {audioSrc && (
                <div className="mb-8 -mt-4">
                  <audio controls src={audioSrc} className="w-full h-11" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {RECALL_RESPONSES.map((response, i) => (
                <button
                  key={response.id}
                  type="button"
                  onClick={() => setFeedback(response.feedback)}
                  className={`w-full py-4 px-6 rounded-2xl font-elderly text-lg font-semibold shadow-sm transition-all text-left flex items-center justify-between ${
                    i === 0
                      ? 'bg-brand-teal text-white hover:bg-brand-tealDark'
                      : 'bg-white text-brand-charcoal hover:bg-brand-surface'
                  }`}
                >
                  <span>{response.label}</span>
                  <Icon name={response.icon} className="w-5 h-5" />
                </button>
              ))}
            </div>

            {feedback && (
              <div className="mt-4 p-4 rounded-2xl bg-white text-brand-charcoal font-elderly text-lg">{feedback}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
