// Seeded/mock content for the Patient interface sections that are still
// out of scope (memory ribbon, daily rhythm, rituals, contacts, voice
// prompts). RecognitionGame and MemoryOfTheDay no longer use this file —
// they're backed by real data from GET /api/patient/memories instead.

export const memoryKeepsakes = [
  { id: 'rina', type: 'Person', title: 'Rina', detail: 'Your daughter · Visits with fresh apples', imageKey: 'rina', actionLabel: 'View photo' },
  { id: 'veranda', type: 'Place', title: 'My Veranda', detail: 'A place you love · Orchids in morning sun', imageKey: 'verandaHills', actionLabel: 'View place' },
  { id: 'hearth', type: 'Gathering', title: 'Sunday Hearth', detail: 'All the children together around the warm hearth', imageKey: 'heroAiton', actionLabel: 'View gathering' },
  { id: 'hymn', type: 'Audio', title: 'Autumn Choir', detail: 'Familiar Khasi choir hymn from Mawkhar Church', actionLabel: 'Listen now' },
];

export const dailyRhythm = [
  { id: 'morning', label: 'Morning', detail: 'Warm ginger tea & rice cake', note: 'Completed peacefully', state: 'done' },
  { id: 'now', label: 'Now', detail: 'Remember something familiar', note: 'Active quiet moment', state: 'active' },
  { id: '1pm', label: '1:00 PM', detail: 'Fresh spring water & veranda rest', note: 'Resting time', state: 'upcoming' },
  { id: '230pm', label: '2:30 PM', detail: 'Afternoon tea & medicine tablet', note: 'Ban will assist', state: 'upcoming' },
  { id: '5pm', label: '5:00 PM', detail: 'Sunset over Umiam lake', note: 'Quiet balcony view', state: 'sunset' },
];

export const rituals = [
  { id: 'remember', title: 'Remember Someone', description: 'A gentle glance at a smiling face from family. Simple questions, zero stress.', duration: '2 minutes', actionLabel: 'Begin', icon: 'personPin' },
  { id: 'morning', title: 'Your Morning', description: 'Veranda, fresh tea, and pine breeze. Arrange three photos of your morning order.', duration: '3 minutes', actionLabel: 'Begin', icon: 'sun' },
  { id: 'song', title: 'A Song You Know', description: 'Bamboo flute and Mawkhar church choir. Listen gently and hum along.', duration: '5 minutes', actionLabel: 'Listen', icon: 'waveform' },
];

export const closeContacts = [
  { id: 'rina', name: 'Rina', relation: 'Daughter', note: 'Visits tomorrow at 11 AM', imageKey: 'rina' },
  { id: 'ban', name: 'Ban', relation: 'Caregiver & Kin', note: 'At home with you', icon: 'face' },
  { id: 'biren', name: 'Biren', relation: 'Brother', note: 'Shillong town', icon: 'elder' },
  { id: 'lyngdoh', name: 'Dr. Lyngdoh', relation: 'Visiting Nurse', note: 'CHW Mesh sync active', icon: 'medical' },
];

export const voicePrompts = [
  { id: 'who-rina', label: '“Who is Rina?”', icon: 'help' },
  { id: 'play-hymn', label: '“Play my morning hymn”', icon: 'music' },
  { id: 'what-now', label: '“What should I do now?”', icon: 'clock' },
  { id: 'lost', label: '“I feel a little lost”', icon: 'home' },
];
