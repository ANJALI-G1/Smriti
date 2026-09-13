import { useEffect, useRef, useState } from 'react';

const MAX_RECORDING_SECONDS = 180; // 3 minutes — plenty for a voice note, keeps uploads small
const ACCEPTED_AUDIO_TYPES = ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/wave', 'audio/x-wav'];
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

// Preference order for MediaRecorder's mimeType — the browser picks the
// first one it actually supports; omitting the option entirely (none
// supported) lets the browser choose its own default rather than fail.
const PREFERRED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];

function pickSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return undefined;
  return PREFERRED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Records audio from the browser microphone (MediaRecorder) or accepts an
// uploaded audio file — whichever the caregiver prefers — and stages the
// result as a File for the parent form to submit on Save. This component
// never uploads anything itself; it only ever hands the parent a Blob/File
// plus an object URL for local preview, mirroring how AddMemoryModal
// already stages image files before submit.
//
// existingAudioUrl: a resolved, playable URL for audio already saved on
// the memory being edited (if any) — shown with its own playback + a
// "Replace" affordance instead of the recorder UI, until the caregiver
// actually starts recording or picks a new file.
export default function AudioRecorder({ existingAudioUrl, onAudioChange, onError }) {
  // 'idle' | 'requesting' | 'recording' | 'recorded' | 'denied' | 'unsupported'
  const [state, setState] = useState('idle');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const objectUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  const isSupported =
    typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';

  useEffect(
    () => () => {
      window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const finalizeRecording = (blob, mimeType) => {
    const file = new File([blob], `recording-${Date.now()}.webm`, { type: mimeType || blob.type || 'audio/webm' });
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    setState('recorded');
    onAudioChange(file);
  };

  const startRecording = async () => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }
    setState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' });
        finalizeRecording(blob, recorder.mimeType || mimeType);
        stopStream();
      };

      recorder.start();
      setState('recording');
      setDurationSeconds(0);
      timerRef.current = window.setInterval(() => {
        setDurationSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch {
      // Covers both explicit permission denial and "no microphone present"
      // — either way, the caregiver can still fall back to uploading a file.
      setState('denied');
      onError?.('Microphone access was denied or unavailable. You can upload an audio file instead.');
    }
  };

  const stopRecording = () => {
    window.clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      onError?.('Please choose a WebM, OGG, MP3, M4A, AAC, or WAV audio file.');
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      onError?.('That audio file is too large — please choose one under 15MB.');
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    setState('recorded');
    setIsReplacing(false);
    onAudioChange(file);
  };

  const handleReRecord = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setDurationSeconds(0);
    setState('idle');
    onAudioChange(null);
  };

  // Editing a memory that already has a saved recording: show that one
  // (playable) with a "Record a new version" / "Upload a new file" pair,
  // until the caregiver actually chooses to replace it.
  if (existingAudioUrl && !isReplacing && state === 'idle') {
    return (
      <div className="space-y-2">
        <audio controls src={existingAudioUrl} className="w-full h-10" />
        <div className="flex items-center gap-4 text-xs">
          <button type="button" onClick={() => setIsReplacing(true)} className="text-brand-teal font-semibold hover:underline">
            Replace this recording
          </button>
        </div>
      </div>
    );
  }

  if (state === 'recording') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50">
        <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-red-700">Recording… {formatDuration(durationSeconds)}</span>
        <button
          type="button"
          onClick={stopRecording}
          className="ml-auto px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    );
  }

  if (state === 'recorded' && previewUrl) {
    return (
      <div className="space-y-2">
        <audio controls src={previewUrl} className="w-full h-10" />
        <div className="flex items-center gap-4 text-xs">
          <button type="button" onClick={handleReRecord} className="text-brand-teal font-semibold hover:underline">
            Re-record
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-brand-slate font-semibold hover:underline">
            Use a file instead
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {state === 'denied' && (
        <p className="text-[11px] text-brand-amber bg-brand-amberSubtle rounded-lg px-3 py-2">
          Microphone access was denied. You can still upload an audio file below.
        </p>
      )}
      {state === 'unsupported' && (
        <p className="text-[11px] text-brand-slate bg-brand-ivory rounded-lg px-3 py-2">
          Recording isn&apos;t supported in this browser. You can still upload an audio file below.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {isSupported && state !== 'unsupported' && (
          <button
            type="button"
            onClick={startRecording}
            disabled={state === 'requesting'}
            className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-charcoal text-xs font-semibold hover:border-brand-teal hover:text-brand-teal transition disabled:opacity-60 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
            {state === 'requesting' ? 'Requesting microphone…' : '🎙️ Record audio'}
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 rounded-xl border border-dashed border-brand-border text-brand-slate hover:border-brand-teal hover:text-brand-teal transition text-xs font-semibold"
        >
          + Upload an audio file
        </button>
      </div>
      {isReplacing && existingAudioUrl && (
        <button
          type="button"
          onClick={() => setIsReplacing(false)}
          className="text-[11px] text-brand-slate hover:text-brand-charcoal underline"
        >
          Cancel — keep the current recording
        </button>
      )}
      {!existingAudioUrl && state === 'idle' && <p className="text-[11px] text-brand-slate">No recording yet.</p>}
      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
    </div>
  );
}
