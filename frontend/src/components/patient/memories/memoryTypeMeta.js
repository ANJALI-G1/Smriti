// Shared display metadata for the 4 real memory types the backend models
// (backend/src/db.js: memories.type CHECK IN 'photo','voice','place','song').
// One source of truth so the category filter, cards, and detail modal all
// agree on labels/badges/icons.
export const MEMORY_TYPE_META = {
  photo: { label: 'Person', categoryLabel: 'People', badgeClass: 'bg-brand-tealSubtle text-brand-teal', icon: 'face' },
  place: { label: 'Place', categoryLabel: 'Places', badgeClass: 'bg-brand-amberSubtle text-brand-amber', icon: 'deck' },
  voice: { label: 'Voice Note', categoryLabel: 'Voice Notes', badgeClass: 'bg-brand-positiveTint text-brand-positive', icon: 'recordVoice' },
  song: { label: 'Song', categoryLabel: 'Songs', badgeClass: 'bg-brand-positiveTint text-brand-positive', icon: 'music' },
};

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Keepsakes' },
  { id: 'photo', label: 'People I Love' },
  { id: 'place', label: 'Places I Know' },
  { id: 'voice', label: 'Voice Notes' },
  { id: 'song', label: 'Sacred Songs' },
];
