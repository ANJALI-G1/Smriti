import { resolveAssetUrl } from '../../api/client.js';

function PersonThumbnail({ src, name }) {
  if (src) {
    return <img src={src} alt={name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-brand-teal/10 shrink-0" />;
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-brand-tealSubtle text-brand-teal flex items-center justify-center shrink-0">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0"
        />
      </svg>
    </div>
  );
}

// Standalone management of the patient's people, independent of any one
// memory — lets a caregiver add someone before they have a photo ready,
// fix a misspelled name in one place (updates every memory of theirs at
// once, since memories link by id), or remove someone entirely.
export default function FamilyMembersPanel({ familyMembers, onAddNew, onEdit, onDelete }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">People</h3>
          <p className="text-[11px] text-brand-slate">Family members Aiton's memories are linked to</p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
        >
          + Add person
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-3.5">
        {familyMembers.length === 0 && (
          <p className="text-xs text-brand-slate text-center py-4">
            No family members added yet. Use &quot;Add person&quot; to add the first one.
          </p>
        )}

        {familyMembers.map((person) => {
          const thumbnailSrc = resolveAssetUrl(person.photoUrl);
          const detailParts = [];
          if (person.relationship) detailParts.push(person.relationship);
          detailParts.push(person.memoryCount === 1 ? '1 memory' : `${person.memoryCount} memories`);

          return (
            <div
              key={person.id}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-brand-ivory transition border border-brand-border/60 group gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <PersonThumbnail src={thumbnailSrc} name={person.name} />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-brand-charcoal truncate">{person.name}</h5>
                  <p className="text-[11px] text-brand-slate truncate">{detailParts.join(' · ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="Edit person"
                  onClick={() => onEdit(person)}
                  className="p-2 rounded-lg text-brand-slate hover:text-brand-teal hover:bg-brand-tealSubtle transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Remove person"
                  onClick={() => onDelete(person)}
                  className="p-2 rounded-lg text-brand-slate hover:text-red-600 hover:bg-red-50 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
