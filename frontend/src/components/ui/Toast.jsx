export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-charcoal text-white text-sm px-4 py-2.5 rounded-xl shadow-elevated">
      {message}
    </div>
  );
}
