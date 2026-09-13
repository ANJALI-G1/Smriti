import { useEffect, useRef, useState } from 'react';
import { ApiError, resolveAssetUrl } from '../../api/client.js';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const FRIENDLY_ERROR = "That person couldn't be saved. Please check the details and try again.";

// onSubmit: async ({ name, relationship, image, removeImage }) => Promise<familyMember>
// Pass `editingMember` to open in edit mode instead of create mode — the
// parent should remount this component (e.g. via a `key` prop) when
// switching who is being edited, so this internal state resets. Mirrors
// AddMemoryModal's conventions so the two feel like one design language.
export default function FamilyMemberModal({ isOpen, onClose, onSubmit, editingMember }) {
  const isEditing = Boolean(editingMember);

  const [name, setName] = useState(editingMember?.name || '');
  const [relationship, setRelationship] = useState(editingMember?.relationship || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(resolveAssetUrl(editingMember?.photoUrl));
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
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
    if (isSubmitting) return;
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter the person's name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        relationship: relationship.trim() || undefined,
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
        <div className="relative w-full sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 text-left shadow-elevated border border-brand-border">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h4 className="font-editorial text-xl font-medium text-brand-charcoal">
              {isEditing ? 'Edit Person' : 'Add a Family Member'}
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
              ? 'Changes update this person everywhere they appear — every memory of theirs updates too.'
              : 'Add someone once, then attach photo memories to them any time.'}
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="contents">
              <div className="space-y-3 text-xs mt-4">
                <div>
                  <label className="block font-medium text-brand-charcoal mb-1">Photo</label>
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

                <div>
                  <label htmlFor="person-name" className="block font-medium text-brand-charcoal mb-1">
                    Name
                  </label>
                  <input
                    id="person-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Uncle Tadit"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="person-relationship" className="block font-medium text-brand-charcoal mb-1">
                    Relationship
                  </label>
                  <input
                    id="person-relationship"
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g., Uncle"
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
                  {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Person'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
