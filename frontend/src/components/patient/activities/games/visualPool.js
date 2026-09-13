import { resolveAssetUrl } from '../../../../api/client.js';
import { GENERIC_ITEMS } from '../genericContent.js';

export const MIN_REAL_ITEMS = 3;

// Builds a pool of "things to recognize" — the patient's own real photos
// (family members + saved places) when there are enough distinct ones to
// make a real game, otherwise the universal generic bank. Shared by
// Remember the Picture and Match Pictures, which both need the same
// "personalize when possible, always playable otherwise" pool.
export function buildVisualPool(familyMembers, memories) {
  const real = [
    ...(familyMembers || [])
      .filter((m) => m.photoUrl)
      .map((m) => ({ id: `fm-${m.id}`, label: m.name, image: resolveAssetUrl(m.photoUrl) })),
    ...(memories || [])
      .filter((m) => m.type === 'place' && m.imageUrl)
      .map((m) => ({ id: `mem-${m.id}`, label: m.title, image: resolveAssetUrl(m.imageUrl) })),
  ];
  if (real.length >= MIN_REAL_ITEMS) return real;
  return GENERIC_ITEMS.map((item) => ({ id: item.id, label: item.label, emoji: item.emoji }));
}
