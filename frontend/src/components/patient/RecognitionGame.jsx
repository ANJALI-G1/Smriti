import { useMemo, useState } from 'react';
import { images } from '../../assets/landingImages.js';
import { resolveAssetUrl } from '../../api/client.js';
import Icon from '../ui/Icon.jsx';

// Fallback for names that predate real photo uploads — a caregiver-uploaded
// photo (member.photoUrl, resolved against the backend origin) always
// takes priority over these.
const KNOWN_PORTRAITS = { rina: images.rina };

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function PersonPortrait({ member }) {
  const knownPhoto = member?.name && KNOWN_PORTRAITS[member.name.toLowerCase()];
  const src = resolveAssetUrl(member?.photoUrl) || knownPhoto;

  if (src) {
    return <img src={src} alt="" className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-brand-tealSubtle text-brand-teal">
      <Icon name="face" className="w-16 h-16" />
    </div>
  );
}

function SectionShell({ children }) {
  return (
    <section className="w-full bg-brand-surface py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm">{children}</div>
      </div>
    </section>
  );
}

function CalmMessage({ icon, title, description, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-4">
      <div className="w-14 h-14 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h2 className="font-serif text-2xl text-brand-teal">{title}</h2>
      <p className="font-elderly text-lg text-brand-slate max-w-md">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-6 py-3 rounded-2xl bg-brand-teal text-white font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealDark transition-all"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default function RecognitionGame({ status, familyMembers = [], onRetry }) {
  const [selectedId, setSelectedId] = useState(null);
  const [answerState, setAnswerState] = useState('idle'); // idle | correct | incorrect

  // Deterministic, no AI: the most recently added family member is today's
  // practice target (family_members are already newest-first from the
  // API); up to two other real people become the distractors. Never
  // manufactures a person that doesn't exist in the caregiver's data.
  const { target, choices } = useMemo(() => {
    if (!familyMembers || familyMembers.length === 0) return { target: null, choices: [] };
    const [first, ...rest] = familyMembers;
    const distractors = rest.slice(0, 2);
    return { target: first, choices: shuffle([first, ...distractors]) };
  }, [familyMembers]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setAnswerState('idle');
  };

  const handleConfirm = () => {
    if (!selectedId || !target) return;
    setAnswerState(selectedId === target.id ? 'correct' : 'incorrect');
  };

  if (status === 'idle' || status === 'loading') {
    return (
      <SectionShell>
        <CalmMessage icon="spa" title="Getting your memory ready…" description="Just a moment, this won't take long." />
      </SectionShell>
    );
  }

  if (status === 'error') {
    return (
      <SectionShell>
        <CalmMessage
          icon="leaf"
          title="We couldn't load this right now."
          description="That's alright — nothing is lost. Let's try again in a moment."
          onRetry={onRetry}
        />
      </SectionShell>
    );
  }

  if (familyMembers.length === 0) {
    return (
      <SectionShell>
        <CalmMessage
          icon="heart"
          title="Something Familiar"
          description="Once your family adds a photo, you'll be able to practice remembering them together here."
        />
      </SectionShell>
    );
  }

  // Exactly one real person on file: nothing to compare them against, so
  // this becomes a gentle introduction rather than a manufactured quiz.
  if (familyMembers.length === 1) {
    const person = familyMembers[0];
    const isGreeted = answerState === 'correct';
    return (
      <SectionShell>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-brand-surface shadow-md">
              <PersonPortrait member={person} />
              <div className="absolute top-4 left-4 bg-brand-teal text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                Memory Keepsake
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 text-brand-amber text-xs font-semibold uppercase tracking-wider mb-2">
              <Icon name="heart" className="w-4 h-4" />
              <span>Something Familiar</span>
            </div>
            <h2 className="font-serif text-3xl text-brand-teal mb-3">This is {person.name}.</h2>
            <p className="font-elderly text-lg text-brand-slate mb-8">
              {person.relationship ? `Your ${person.relationship}.` : 'Someone close to you.'}
            </p>
            <button
              type="button"
              onClick={() => setAnswerState('correct')}
              className={`h-16 px-8 rounded-2xl font-elderly text-xl font-bold flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.98] ${
                isGreeted ? 'bg-brand-positive text-white' : 'bg-brand-teal text-white hover:bg-brand-tealDark'
              }`}
            >
              <Icon name={isGreeted ? 'checkCircle' : 'smile'} className="w-6 h-6" />
              <span>{isGreeted ? `Yes, this is ${person.name}!` : "Let's remember together"}</span>
            </button>
            <p className="text-brand-slate font-elderly text-base flex items-center gap-2 mt-4">
              <Icon name="spa" className="w-4 h-4 text-brand-amber" />
              <span>Take your time. There is no hurry or score here.</span>
            </p>
          </div>
        </div>
      </SectionShell>
    );
  }

  const hint = target.relationship
    ? `Someone close to you — your ${target.relationship}.`
    : 'Someone from your family.';

  return (
    <SectionShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-brand-surface shadow-md">
            <PersonPortrait member={target} />
            <div className="absolute top-4 left-4 bg-brand-teal text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Memory Keepsake
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-2 text-brand-amber text-xs font-semibold uppercase tracking-wider mb-2">
            <Icon name="heart" className="w-4 h-4" />
            <span>Something Familiar</span>
          </div>
          <h2 className="font-serif text-3xl text-brand-teal mb-3">Who is this?</h2>
          <p className="font-elderly text-lg text-brand-slate mb-6">{hint}</p>

          <div className="flex flex-col gap-3 mb-8">
            {choices.map((member, i) => {
              const isSelected = selectedId === member.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelect(member.id)}
                  className={`text-left w-full px-6 py-4 rounded-2xl shadow-sm flex items-center justify-between transition-all ${
                    isSelected ? 'bg-brand-tealSubtle text-brand-teal' : 'bg-brand-surface text-brand-charcoal hover:bg-brand-border/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-brand-teal/15 text-brand-teal' : 'bg-white text-brand-slate'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-elderly text-xl font-bold">
                      {member.name}
                      {member.relationship ? ` (${member.relationship})` : ''}
                    </span>
                  </div>
                  <Icon
                    name={isSelected ? 'checkCircle' : 'circleOutline'}
                    className={`w-6 h-6 shrink-0 ${isSelected ? 'text-brand-teal' : 'text-brand-border'}`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`h-16 px-8 rounded-2xl font-elderly text-xl font-bold flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 ${
              answerState === 'correct' ? 'bg-brand-positive text-white' : 'bg-brand-teal text-white hover:bg-brand-tealDark'
            }`}
          >
            <Icon name={answerState === 'correct' ? 'checkCircle' : 'smile'} className="w-6 h-6" />
            <span>
              {answerState === 'correct'
                ? `Yes, this is ${target.name}!`
                : "Let's remember together"}
            </span>
          </button>

          {answerState === 'incorrect' && (
            <div className="mt-4 p-4 rounded-2xl bg-brand-amberSubtle text-brand-charcoal font-elderly text-lg flex items-start gap-2">
              <Icon name="spa" className="w-5 h-5 text-brand-amber shrink-0 mt-1" />
              <span>
                That&apos;s alright — this is {target.name}
                {target.relationship ? `, your ${target.relationship}` : ''}. Let&apos;s remember together.
              </span>
            </div>
          )}

          <p className="text-brand-slate font-elderly text-base flex items-center gap-2 mt-4">
            <Icon name="spa" className="w-4 h-4 text-brand-amber" />
            <span>Take your time. There is no hurry or score here.</span>
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
