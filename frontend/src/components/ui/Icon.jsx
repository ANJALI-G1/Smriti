// Small shared inline-SVG icon set. We deliberately avoid pulling in an icon
// font/library (e.g. Material Symbols) — the rest of the app uses plain SVG
// paths, so this keeps one icon approach across the project.
const PATHS = {
  mic: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z',
  volume: 'M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M18.36 5.64a9 9 0 010 12.73',
  heart: 'M12 21s-6.7-4.35-9.33-8.2C1.02 10.28 1.9 6.6 5.1 5.3c2-.8 4.1-.1 5.4 1.6.4.5 1.1.5 1.5 0 1.3-1.7 3.4-2.4 5.4-1.6 3.2 1.3 4.08 4.98 2.43 7.5C18.7 16.65 12 21 12 21z',
  checkCircle: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  circleOutline: 'M12 21a9 9 0 100-18 9 9 0 000 18z',
  leaf: 'M4 20c8-2 12-8 12-16-8 0-12 6-12 16zM4 20c0-4 2-7 5-9',
  deck: 'M4 21V9l8-6 8 6v12M9 21V13h6v8',
  spa: 'M12 3c0 5-4 5-4 10a4 4 0 108 0c0-5-4-5-4-10z',
  smile: 'M9 14s1.5 2 3 2 3-2 3-2M9 9h.01M15 9h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  help: 'M9.09 9a3 3 0 115.83 1c0 2-3 2-3 4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  home: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10',
  routine: 'M12 8v4l2.5 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  sunset: 'M12 3v4M4.2 11h1.5M18.3 11h1.5M6 11a6 6 0 0112 0M4 15h16M6 18h12M12 15v-2',
  personPin: 'M12 12a3 3 0 100-6 3 3 0 000 6zm0 0c-3 0-6 1.5-6 4v2h12v-2c0-2.5-3-4-6-4z',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66l1.42-1.42M4.92 19.08l1.42-1.42M19.08 19.08l-1.42-1.42M4.92 4.92L6.34 6.34M17 12a5 5 0 11-10 0 5 5 0 0110 0z',
  waveform: 'M4 12h2v3H4zM8 8h2v11H8zM12 5h2v17h-2zM16 9h2v9h-2zM20 11h2v5h-2z',
  arrowRight: 'M5 12h14m0 0l-6-6m6 6l-6 6',
  play: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zM10 9l5 3-5 3V9z',
  disc: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9 12a3 3 0 106 0 3 3 0 00-6 0z',
  face: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0',
  elder: 'M12 8a3 3 0 100-6 3 3 0 000 6zM6 21c0-3 2.5-6 6-6s6 3 6 6M9 15l-2 6M15 15l2 6',
  medical: 'M12 8v8m-4-4h8M5 6h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6z',
  recordVoice: 'M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0M12 17v3m-3 0h6',
  close: 'M6 18L18 6M6 6l12 12',
  playCircle: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 9l5 3-5 3V9z',
  chevronLeft: 'M15 19l-7-7 7-7',
  photo: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16l4-4a2 2 0 012.8 0L16 17M14 13l1.6-1.6a2 2 0 012.8 0L20 13',
  refresh: 'M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0014.5 3.5M19.5 9A8 8 0 005 5.5',
};

export default function Icon({ name, className = 'w-5 h-5' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}
