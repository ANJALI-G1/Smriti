import Icon from '../../ui/Icon.jsx';

export default function ActivityCard({ activity, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-left flex flex-col items-center text-center gap-3 active:scale-[0.98]"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-tealSubtle text-brand-teal flex items-center justify-center">
        <Icon name={activity.icon} className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-xl text-brand-charcoal">{activity.title}</h3>
      <p className="font-elderly text-base text-brand-slate">{activity.instructions}</p>
    </button>
  );
}
