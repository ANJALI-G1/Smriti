export default function FloatingAddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 md:bottom-8 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-brand-teal text-white rounded-full shadow-lg hover:bg-brand-tealDark hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand-teal/20 group"
    >
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-xs font-bold tracking-wide pr-1">Add Memory</span>
    </button>
  );
}
