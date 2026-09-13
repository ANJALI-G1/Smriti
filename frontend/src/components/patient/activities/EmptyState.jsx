import Icon from '../../ui/Icon.jsx';

// Shown when a personalized game doesn't have enough of the patient's own
// data yet (e.g. no family photos for "People I Know") — calm and
// honest rather than forcing a game with fabricated content.
export default function EmptyState({ icon = 'heart', title, description }) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-4">
      <div className="w-14 h-14 rounded-full bg-white text-brand-teal flex items-center justify-center">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl text-brand-teal">{title}</h3>
      <p className="font-elderly text-lg text-brand-slate max-w-md">{description}</p>
    </div>
  );
}
