import { useState } from 'react';
import { Check, ChevronDown, Trash2 } from 'lucide-react';
import { STATUS_META, STATUS_ORDER, type Book, type ReadingStatus } from '@/types';

interface Props {
  book: Book;
  onSetStatus: (id: string, status: ReadingStatus) => void;
  onRemove: (id: string) => void;
}

export function BookCard({ book, onSetStatus, onRemove }: Props) {
  const meta = STATUS_META[book.status];
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`}
            aria-hidden
          />
          <div>
            <h3 className="text-base font-semibold leading-snug text-slate-900">
              {book.title}
            </h3>
          </div>
        </div>

        <button
          onClick={() => onRemove(book.id)}
          aria-label={`Delete ${book.title}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-xs font-medium text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      <div className="mt-auto">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Change status
          <ChevronDown
            className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              {STATUS_ORDER.map((s) => {
                const sm = STATUS_META[s];
                const selected = book.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onSetStatus(book.id, s);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${sm.dot}`} />
                      {sm.label}
                    </span>
                    {selected && <Check className="h-4 w-4 text-slate-900" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
