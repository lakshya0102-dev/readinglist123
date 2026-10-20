import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { STATUS_META, STATUS_ORDER, type ReadingStatus } from '@/types';

interface Props {
  onAdd: (title: string, status: ReadingStatus) => void;
  existingTitles: string[];
}

const MAX_TITLE_LENGTH = 60;

function normalize(title: string): string {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function AddBookForm({ onAdd, existingTitles }: Props) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a book title.');
      return;
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError('Book title must be 60 characters or fewer.');
      return;
    }
    if (existingTitles.includes(normalize(trimmed))) {
      setError('This book is already in your reading list.');
      return;
    }
    onAdd(trimmed, status);
    setTitle('');
    setStatus('want');
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter a book title..."
            maxLength={MAX_TITLE_LENGTH}
            aria-label="Book title"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-300"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            aria-label="Reading status"
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
