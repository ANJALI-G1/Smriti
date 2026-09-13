import { images } from '../../assets/landingImages.js';
import { resolveAssetUrl } from '../../api/client.js';

const TYPE_LABEL = {
  photo: 'Family',
  place: 'Place',
  voice: 'Audio Anchor',
  song: 'Audio Anchor',
};

const TYPE_BADGE = {
  photo: 'bg-brand-tealSubtle text-brand-teal',
  place: 'bg-brand-amberSubtle text-brand-amber',
  voice: 'bg-brand-tealSubtle text-brand-teal',
  song: 'bg-brand-tealSubtle text-brand-teal',
};

// Fallback for the seeded demo rows, which predate real photo uploads —
// a caregiver-uploaded image (resolved below) always takes priority over these.
const KNOWN_THUMBNAILS = {
  rina: images.rina,
  'wooden veranda garden': images.verandaHills,
};

function formatDate(isoLikeString) {
  // SQLite's datetime('now') returns 'YYYY-MM-DD HH:MM:SS' (UTC, no 'T'/'Z') — normalize before parsing.
  const date = new Date(`${isoLikeString.replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// A person's photo lives on the family member; everything else's image
// lives on the memory itself — same rule as backend/routes/caregiver.js.
function thumbnailFor(memory, displayName) {
  const uploadedPath = memory.type === 'photo' ? memory.familyMemberPhotoUrl : memory.imageUrl;
  return resolveAssetUrl(uploadedPath) || KNOWN_THUMBNAILS[displayName?.toLowerCase()] || null;
}

function MemoryThumbnail({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover ring-1 ring-brand-teal/10 group-hover:scale-105 transition shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-brand-tealSubtle text-brand-teal flex items-center justify-center shrink-0">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    </div>
  );
}

export default function MemoryBank({ memories, onAddNew, onEdit, onDelete }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Active Memories</h3>
          <p className="text-[11px] text-brand-slate">Anchors currently loaded on the tablet</p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
        >
          + Add memory
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-3.5">
        {memories.length === 0 && (
          <p className="text-xs text-brand-slate text-center py-4">
            No memories added yet. Use &quot;Add Memory&quot; to create the first one.
          </p>
        )}

        {memories.map((memory) => {
          const displayName = memory.familyMemberName || memory.title;
          const subtitleParts = [];
          if (memory.type === 'photo' && memory.title && memory.title !== memory.familyMemberName) {
            subtitleParts.push(memory.title);
          }
          if (memory.description) {
            subtitleParts.push(memory.description);
          } else if (memory.type === 'photo' && memory.familyMemberRelationship) {
            subtitleParts.push(memory.familyMemberRelationship);
          }
          const detail = subtitleParts.join(' · ') || '—';
          const dateLabel = formatDate(memory.createdAt);
          const thumbnailSrc = thumbnailFor(memory, displayName);

          const audioSrc = memory.type === 'voice' ? resolveAssetUrl(memory.audioUrl) : null;

          return (
            <div
              key={memory.id}
              className="p-2.5 rounded-2xl hover:bg-brand-ivory transition border border-brand-border/60 group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <MemoryThumbnail src={thumbnailSrc} name={displayName} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-xs font-bold text-brand-charcoal">{displayName}</h5>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[memory.type]}`}>
                        {TYPE_LABEL[memory.type]}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-slate truncate">{detail}</p>
                    {dateLabel && <p className="text-[10px] text-brand-slate mt-0.5">Added {dateLabel}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    title="Edit memory"
                    onClick={() => onEdit(memory)}
                    className="p-2 rounded-lg text-brand-slate hover:text-brand-teal hover:bg-brand-tealSubtle transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Delete memory"
                    onClick={() => onDelete(memory)}
                    className="p-2 rounded-lg text-brand-slate hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {audioSrc && <audio controls src={audioSrc} className="w-full h-8 mt-2" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
