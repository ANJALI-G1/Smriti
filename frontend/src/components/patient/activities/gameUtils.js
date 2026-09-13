// Small helpers shared by every game under ./games — deliberately tiny
// and dependency-free (no game library), matching the rest of the
// patient UI's plain-React approach.

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandom(array, count) {
  return shuffle(array).slice(0, count);
}

export function pickOne(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}
