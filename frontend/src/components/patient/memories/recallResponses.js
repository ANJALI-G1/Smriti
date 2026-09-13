// The same gentle, non-evaluative three-response interaction used by
// MemoryOfTheDay on the Home page — shared here so the Memories page's
// detail view reuses the identical established pattern instead of a new
// one. Feedback text stays generic (not memory-specific): tailoring it
// per memory would need generation logic that's out of scope.
export const RECALL_RESPONSES = [
  { id: 'yes', label: 'Yes, I remember', icon: 'heart', feedback: 'Wonderful! Your heart holds so many bright days.' },
  { id: 'tell', label: 'Tell me about it', icon: 'recordVoice', feedback: 'Let your family tell you more about this one next time you see them.' },
  { id: 'unsure', label: "I'm not sure", icon: 'leaf', feedback: "That's completely okay. Let's look together whenever you feel like it." },
];
