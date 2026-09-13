// A small, universal content bank used by games that must always be
// playable — even for a brand-new patient with zero saved memories yet.
// "Remember the Picture" and "Match Pictures" prefer the patient's own
// real photos when there are enough of them, falling back to this;
// "Familiar Things" always uses it, since it's explicitly a generic
// recognition game rather than a personalized one. Plain emoji rather
// than image files: zero assets to manage, and large/legible by nature.
export const GENERIC_ITEMS = [
  { id: 'apple', emoji: '🍎', label: 'Apple', category: 'Fruit' },
  { id: 'banana', emoji: '🍌', label: 'Banana', category: 'Fruit' },
  { id: 'orange', emoji: '🍊', label: 'Orange', category: 'Fruit' },
  { id: 'grapes', emoji: '🍇', label: 'Grapes', category: 'Fruit' },
  { id: 'dog', emoji: '🐶', label: 'Dog', category: 'Animal' },
  { id: 'cat', emoji: '🐱', label: 'Cat', category: 'Animal' },
  { id: 'bird', emoji: '🐦', label: 'Bird', category: 'Animal' },
  { id: 'cow', emoji: '🐄', label: 'Cow', category: 'Animal' },
  { id: 'car', emoji: '🚗', label: 'Car', category: 'Object' },
  { id: 'shoe', emoji: '👟', label: 'Shoe', category: 'Object' },
  { id: 'chair', emoji: '🪑', label: 'Chair', category: 'Object' },
  { id: 'umbrella', emoji: '☂️', label: 'Umbrella', category: 'Object' },
  { id: 'cup', emoji: '☕', label: 'Cup of Tea', category: 'Object' },
  { id: 'flower', emoji: '🌸', label: 'Flower', category: 'Nature' },
  { id: 'sun', emoji: '☀️', label: 'Sun', category: 'Nature' },
  { id: 'tree', emoji: '🌳', label: 'Tree', category: 'Nature' },
];

export const CATEGORIES = [...new Set(GENERIC_ITEMS.map((item) => item.category))];

export function itemsInCategory(category) {
  return GENERIC_ITEMS.filter((item) => item.category === category);
}

export function itemsOutsideCategory(category) {
  return GENERIC_ITEMS.filter((item) => item.category !== category);
}
