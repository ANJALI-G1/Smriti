import { resolveAssetUrl } from '../../../api/client.js';
import Icon from '../../ui/Icon.jsx';

// A family member's own memory (if any) carries a real description entered
// by the caregiver for them specifically — used as a caption here since
// it's genuine associated data, not an invented bio.
function captionFor(person, memories) {
  const theirMemory = memories.find((m) => m.familyMemberId === person.id && m.description);
  return theirMemory?.description || null;
}

export default function PeopleIKnowSection({ familyMembers, memories, onShowToast }) {
  if (!familyMembers || familyMembers.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto pt-14 pb-6">
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-brand-amber font-bold">Face Recognition &amp; Comfort</span>
        <h2 className="font-serif text-3xl text-brand-teal mt-1">People I Know</h2>
        <p className="font-elderly text-lg text-brand-slate mt-1">Faces that are warm, familiar, and always welcome here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {familyMembers.map((person) => {
          const photoUrl = resolveAssetUrl(person.photoUrl);
          const caption = captionFor(person, memories);
          return (
            <div key={person.id} className="bg-white p-5 rounded-2xl shadow-sm border border-brand-border flex flex-col">
              <div className="w-full h-48 rounded-xl overflow-hidden bg-brand-surface mb-4">
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-teal">
                    <Icon name="face" className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <h3 className="font-serif text-xl text-brand-charcoal">{person.name}</h3>
                {person.relationship && (
                  <span className="text-[10px] uppercase tracking-wide font-bold px-2.5 py-0.5 rounded-full bg-brand-amberSubtle text-brand-amber">
                    {person.relationship}
                  </span>
                )}
              </div>
              {caption && <p className="font-elderly text-sm text-brand-slate mt-2 leading-relaxed">{caption}</p>}
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => onShowToast(`Hearing ${person.name}'s voice isn't available yet — it will be added soon.`)}
                  className="w-full h-14 rounded-full bg-brand-surface hover:bg-brand-border/50 text-brand-teal flex items-center justify-center gap-2.5 transition-colors"
                >
                  <Icon name="playCircle" className="w-5 h-5" />
                  <span className="font-elderly text-sm font-bold">Hear {person.name}&apos;s Voice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
