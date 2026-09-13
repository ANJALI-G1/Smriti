import { resolveAssetUrl } from '../../../api/client.js';
import Icon from '../../ui/Icon.jsx';
import { MEMORY_TYPE_META } from './memoryTypeMeta.js';

// Strictly real images only for this page — resolves the actual uploaded
// file (memory's own image, or its family member's photo for `photo`-type
// memories, matching the same ownership rule the backend/caregiver side
// uses) and falls back to an honest icon tile. No external placeholder
// URLs, no fabricated photos.
function memoryImageUrl(memory) {
  return resolveAssetUrl(memory.imageUrl) || resolveAssetUrl(memory.familyMemberPhotoUrl) || null;
}

export function memoryDisplayName(memory) {
  return memory.familyMemberName || memory.title;
}

export function memorySubtitle(memory) {
  if (memory.type === 'photo' && memory.familyMemberRelationship) return `Your ${memory.familyMemberRelationship}`;
  if (memory.type === 'photo' && memory.title && memory.title !== memory.familyMemberName) return memory.title;
  return memory.description || null;
}

export default function MemoryCard({ memory, size = 'md', onOpen }) {
  const meta = MEMORY_TYPE_META[memory.type];
  const imageUrl = memoryImageUrl(memory);
  const displayName = memoryDisplayName(memory);
  const subtitle = memorySubtitle(memory);
  const imageHeightClass = size === 'lg' ? 'h-64 sm:h-80' : 'h-44';

  return (
    <button
      type="button"
      onClick={() => onOpen(memory)}
      className="group text-left bg-white rounded-2xl overflow-hidden border border-brand-border shadow-sm hover:shadow-md transition-all flex flex-col w-full"
    >
      <div className={`relative w-full ${imageHeightClass} bg-brand-surface overflow-hidden`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-teal">
            <Icon name={meta?.icon || 'heart'} className="w-12 h-12" />
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-bold ${meta?.badgeClass || 'bg-brand-tealSubtle text-brand-teal'}`}>
          {meta?.label || memory.type}
        </span>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-serif text-xl text-brand-charcoal">{displayName}</h3>
          {subtitle && <p className="font-elderly text-sm text-brand-slate mt-1">{subtitle}</p>}
        </div>
        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-brand-teal group-hover:text-brand-tealDark">
          <span className="font-elderly text-sm font-bold">View memory</span>
          <Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
