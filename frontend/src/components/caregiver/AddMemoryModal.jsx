import { useEffect, useRef, useState } from 'react';
import { ApiError, resolveAssetUrl } from '../../api/client.js';

const MEMORY_TYPES = [
  { id: 'photo', label: '📷 Family Photograph' },
  { id: 'voice', label: '🎙️ Voice Message / Story' },
  { id: 'place', label: '🏡 Familiar Place / Veranda' },
  { id: 'song', label: '🎵 Traditional Festival Song' },
];

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const FRIENDLY_ERROR = "That memory couldn't be saved. Please check the details and try again.";

// The image that "belongs to" a memory depends on its type — a person's
// photo lives on the family member (family_members.photo_url), everything
// else (place/voice/song) has no family member and uses the memory's own
// image_url instead. See backend/src/routes/caregiver.js for the same rule.
function existingImagePathFor(memory) {
  if (!memory) return null;
  return memory.type === 'photo' ? memory.familyMemberPhotoUrl : memory.imageUrl;
}

// onSubmitMemory: async ({ type, name, relationship, title, description, image, removeImage }) => Promise<memory>
// Throws on failure — this component only owns form/submission UI state,
// the actual API call and dashboard refresh live in the parent page.
// Pass `editingMemory` to open in edit mode instead of create mode — the
// parent should remount this component (e.g. via a `key` prop) when
// switching which memory is being edited, so this internal state resets.
export default function AddMemoryModal({ isOpen, onClose, onSubmitMemory, patientName, editingMemory }) {
  const isEditing = Boolean(editingMemory);
  const existingImagePath = existingImagePathFor(editingMemory);

  const [type, setType] = useState(editingMemory?.type || 'photo');
  const [name, setName] = useState(editingMemory?.familyMemberName || '');
  const [relationship, setRelationship] = useState(editingMemory?.familyMemberRelationship || '');
  const [title, setTitle] = useState(editingMemory?.title || '');
  const [description, setDescription] = useState(editingMemory?.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(resolveAssetUrl(existingImagePath));
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Revoke any object URL we created for a local preview when it's replaced or unmounted.
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return; // don't let the backdrop/✕ interrupt an in-flight save
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('That image is too large — please choose one under 5MB.');
      return;
    }

    setError('');
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setImageFile(file);
    setImagePreview(previewUrl);
    setImageRemoved(false);
  };

  const handleRemoveImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // guards against double-submit (e.g. double-click, double Enter)
    setError('');

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a memory title.');
      return;
    }
    if (type === 'photo' && !name.trim()) {
      setError("Please enter the family member's name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitMemory({
        type,
        name: type === 'photo' ? name.trim() : undefined,
        relationship: type === 'photo' ? relationship.trim() : undefined,
        title: trimmedTitle,
        description: description.trim() || undefined,
        image: imageFile || undefined,
        removeImage: imageRemoved && !imageFile,
      });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : FRIENDLY_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full sm:max-w-lg rounded-3xl bg-white p-6 sm:p-8 text-left shadow-elevated border border-brand-border">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h4 className="font-editorial text-xl font-medium text-brand-charcoal">
              {isEditing ? 'Edit Memory' : `Add to ${patientName}'s Memory Bank`}
            </h4>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-brand-slate hover:text-brand-charcoal disabled:opacity-40"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-brand-slate mt-2">
            {isEditing
              ? 'Changes are saved to the memory bank right away.'
              : `New memories are saved to ${patientName}'s memory bank and will be available for her games and voice prompts.`}
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="contents">
              <div className="grid grid-cols-2 gap-2.5 my-4">
                {MEMORY_TYPES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setType(option.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition disabled:opacity-50 ${
                      type === option.id
                        ? 'border-brand-teal bg-brand-tealSubtle text-brand-teal font-semibold'
                        : 'border-brand-border bg-white text-brand-charcoal hover:border-brand-teal'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs">
                {/* Image upload/preview */}
                <div>
                  <label className="block font-medium text-brand-charcoal mb-1">
                    {type === 'photo' ? "Family Member's Photo" : 'Photo (optional)'}
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-brand-border shrink-0"
                      />
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-brand-teal font-semibold hover:underline text-left"
                        >
                          Change photo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-600 font-semibold hover:underline text-left"
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 rounded-xl border border-dashed border-brand-border text-brand-slate hover:border-brand-teal hover:text-brand-teal transition"
                    >
                      + Upload a photo (JPEG, PNG, or WebP, up to 5MB)
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {type === 'photo' && (
                  <>
                    <div>
                      <label htmlFor="memory-name" className="block font-medium text-brand-charcoal mb-1">
                        Family Member&apos;s Name
                      </label>
                      <input
                        id="memory-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Uncle Tadit"
                        className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="memory-relationship" className="block font-medium text-brand-charcoal mb-1">
                        Relationship
                      </label>
                      <input
                        id="memory-relationship"
                        type="text"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        placeholder="e.g., Uncle"
                        className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="memory-title" className="block font-medium text-brand-charcoal mb-1">
                    Memory Title
                  </label>
                  <input
                    id="memory-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Uncle Tadit's Ginger Harvest"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="memory-clue" className="block font-medium text-brand-charcoal mb-1">
                    Cultural or Episodic Clue
                  </label>
                  <textarea
                    id="memory-clue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., 'He visited with sweet wild honey from Ri-Bhoi...'"
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-brand-border text-brand-slate disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal text-white font-semibold hover:bg-brand-tealDark disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Save & Sync to Tablet'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
