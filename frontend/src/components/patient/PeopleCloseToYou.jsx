import { images } from '../../assets/landingImages.js';
import Icon from '../ui/Icon.jsx';
import { closeContacts } from '../../data/patientMock.js';

export default function PeopleCloseToYou() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-8">
      <div className="mb-8">
        <span className="text-xs uppercase text-brand-amber tracking-wider font-semibold block mb-1">
          Family &amp; Support
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-brand-teal">People Close To You</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {closeContacts.map((person) => (
          <div key={person.id} className="bg-white rounded-3xl p-6 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 shadow-sm bg-brand-surface flex items-center justify-center text-brand-teal">
              {person.imageKey ? (
                <img src={images[person.imageKey]} alt="" className="w-full h-full object-cover" />
              ) : (
                <Icon name={person.icon} className="w-9 h-9" />
              )}
            </div>
            <h4 className="font-serif text-lg text-brand-charcoal mb-0.5">{person.name}</h4>
            <span className="font-elderly text-sm text-brand-amber">{person.relation}</span>
            <span className="text-xs text-brand-muted mt-2">{person.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
