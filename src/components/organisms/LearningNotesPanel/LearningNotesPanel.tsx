import type { ChangeEvent } from 'react';

import Button from '@/components/atoms/Button';

import './index.css';

interface NoteEntry {
  id: string;
  timestamp: number;
  text: string;
}

interface LearningNotesPanelProps {
  notes: NoteEntry[];
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  onAddNote: () => void;
  onSeekToNote: (timestamp: number) => void;
}

const formatTimestamp = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function LearningNotesPanel({
  notes,
  noteDraft,
  onNoteDraftChange,
  onAddNote,
  onSeekToNote,
}: LearningNotesPanelProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onNoteDraftChange(event.target.value);
  };

  return (
    <section className="learning-notes">
      <div className="learning-notes-header">
        <h3>Notes</h3>
        <span className="learning-notes-count">{notes.length} saved</span>
      </div>

      <div className="learning-notes-form">
        <textarea
          placeholder="Write a note..."
          value={noteDraft}
          onChange={handleChange}
        />
        <Button type="button" variant="secondary" onClick={onAddNote} disabled={!noteDraft.trim()}>
          Add note
        </Button>
      </div>

      <ul className="learning-notes-list">
        {notes.length === 0 ? (
          <li className="learning-notes-empty">No notes yet.</li>
        ) : (
          notes.map((note) => (
            <li key={note.id}>
              <button type="button" onClick={() => onSeekToNote(note.timestamp)}>
                {formatTimestamp(note.timestamp)}
              </button>
              <p>{note.text}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
