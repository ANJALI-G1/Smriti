import { useState } from 'react';
import { resolveAssetUrl } from '../../../api/client.js';
import { formatSqliteDate } from '../../../utils/formatDate.js';
import Icon from '../../ui/Icon.jsx';
import { MEMORY_TYPE_META } from './memoryTypeMeta.js';
import { RECALL_RESPONSES } from './recallResponses.js';
import { memoryDisplayName } from './MemoryCard.jsx';

// Shown for a 'song' memory (the app has no stored audio for that type
// yet) or a legacy 'voice' memory saved before recordings were supported —
// an honest explanation rather than a fake player.
function PlaybackNotAvailable() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-brand-surface text-brand-slate font-elderly text-base flex items-start gap-3">
      <Icon name="playCircle" className="w-6 h-6 shrink-0 text-brand-muted" />
      <span>Listening to this one isn&apos;t available yet — it will be added soon.</span>
    </div>
  );
}

// The real thing: a caregiver-recorded/uploaded voice memory's actual
// saved audio (memory.audioUrl), played with the browser's native
// controls — sized generously to stay easy to tap for an elderly user.
function AudioPlayback({ audioUrl }) {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-brand-surface">
      <p className="font-elderly text-base text-brand-slate mb-2">Press play to listen</p>
      <audio controls src={audioUrl} className="w-full h-12" />
    </div>
  );
}

export default function MemoryDetailModal({ memory, onClose }) {
  const [feedback, setFeedback] = useState('');
  if (!memory) return null;

  const meta = MEMORY_TYPE_META[memory.type];
  const imageUrl = resolveAssetUrl(memory.imageUrl) || resolveAssetUrl(memory.familyMemberPhotoUrl);
  const displayName = memoryDisplayName(memory);
  const dateLabel = formatSqliteDate(memory.createdAt, { month: 'long', day: 'numeric', year: 'numeric' });
  const audioUrl = memory.type === 'voice' ? resolveAssetUrl(memory.audioUrl) : null;
  const canPlay = (memory.type === 'voice' || memory.type === 'song') && !audioUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-detail-title"
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-elevated border border-brand-border p-6 sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close memory"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-brand-surface text-brand-charcoal flex items-center justify-center hover:bg-brand-border/60 transition-colors z-10"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>

          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-brand-surface mb-5">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-teal">
                <Icon name={meta?.icon || 'heart'} className="w-16 h-16" />
              </div>
            )}
          </div>

          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-bold mb-2 ${meta?.badgeClass || 'bg-brand-tealSubtle text-brand-teal'}`}>
            {meta?.label || memory.type}
          </span>
          <h3 id="memory-detail-title" className="font-serif text-2xl sm:text-3xl text-brand-teal">
            {displayName}
          </h3>
          {memory.type === 'photo' && memory.familyMemberRelationship && (
            <p className="font-elderly text-lg text-brand-slate mt-1">Your {memory.familyMemberRelationship}</p>
          )}
          {memory.type === 'photo' && memory.title && memory.title !== memory.familyMemberName && (
            <p className="font-elderly text-base text-brand-amber mt-1">{memory.title}</p>
          )}
          {memory.description && (
            <p className="font-elderly text-lg text-brand-charcoal mt-4 leading-relaxed">{memory.description}</p>
          )}
          {dateLabel && <p className="text-xs text-brand-muted mt-4">Added {dateLabel}</p>}

          {audioUrl && <AudioPlayback audioUrl={audioUrl} />}
          {canPlay && <PlaybackNotAvailable />}

          <div className="mt-6 pt-6 border-t border-brand-border">
            <p className="font-elderly text-lg text-brand-teal font-bold mb-4">Do you remember this, Aiton?</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {RECALL_RESPONSES.map((response, i) => (
                <button
                  key={response.id}
                  type="button"
                  onClick={() => setFeedback(response.feedback)}
                  className={`px-6 py-3.5 rounded-2xl font-elderly text-base font-semibold flex items-center gap-2 transition-all ${
                    i === 0
                      ? 'bg-brand-teal text-white hover:bg-brand-tealDark'
                      : 'bg-brand-surface text-brand-charcoal hover:bg-brand-border/50'
                  }`}
                >
                  <Icon name={response.icon} className="w-5 h-5" />
                  <span>{response.label}</span>
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-4 p-4 rounded-2xl bg-brand-tealSubtle text-brand-charcoal font-elderly text-lg">
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
