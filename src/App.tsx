import { useMemo, useState } from 'react';
import { Library, BookOpen, BookMarked, CheckCircle2 } from 'lucide-react';
import { useReadingList } from '@/useReadingList';
import { AddBookForm } from '@/components/AddBookForm';
import { FilterTabs, type Filter } from '@/components/FilterTabs';
import { BookCard } from '@/components/BookCard';

export default function App() {
  const { books, addBook, setStatus, removeBook } = useReadingList();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: books.length,
      want: 0,
      reading: 0,
      finished: 0,
    };
    for (const b of books) c[b.status]++;
    return c;
  }, [books]);

  const visible = useMemo(() => {
    if (filter === 'all') return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const existingTitles = useMemo(
    () =>
      books.map((b) =>
        b.title.trim().replace(/\s+/g, ' ').toLowerCase()
      ),
    [books]
  );

  const hasBooks = books.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Reading List
            </h1>
            <p className="text-sm text-slate-500">
              Track books you want to read, are reading, or have finished.
            </p>
          </div>
        </header>

        <AddBookForm onAdd={addBook} existingTitles={existingTitles} />

        {hasBooks && (
          <Summary
            total={counts.all}
            reading={counts.reading}
            finished={counts.finished}
          />
        )}

        {hasBooks && (
          <div className="mt-6">
            <FilterTabs active={filter} counts={counts} onChange={setFilter} />
          </div>
        )}

        <main className="mt-6">
          {!hasBooks ? (
            <EmptyState />
          ) : visible.length === 0 ? (
            <NoMatches />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSetStatus={setStatus}
                  onRemove={removeBook}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-xs text-slate-400">
          {hasBooks
            ? `${books.length} book${books.length === 1 ? '' : 's'} · saved on this device`
            : 'Saved on this device only'}
        </footer>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Library className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-base font-medium text-slate-700">
        Your reading list is empty. Add your first book.
      </p>
    </div>
  );
}

function NoMatches() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-600">
        No books match this filter.
      </p>
      <p className="mt-1 text-sm text-slate-400">Try a different filter above.</p>
    </div>
  );
}

function Summary({
  total,
  reading,
  finished,
}: {
  total: number;
  reading: number;
  finished: number;
}) {
  const items = [
    {
      label: 'Total Books',
      value: total,
      icon: BookOpen,
      iconClass: 'text-slate-600',
      bgClass: 'bg-slate-100',
    },
    {
      label: 'Currently Reading',
      value: reading,
      icon: BookMarked,
      iconClass: 'text-sky-600',
      bgClass: 'bg-sky-100',
    },
    {
      label: 'Finished',
      value: finished,
      icon: CheckCircle2,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-100',
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:p-4"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bgClass}`}
            >
              <Icon className={`h-4 w-4 ${item.iconClass}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold leading-none text-slate-900 sm:text-2xl">
                {item.value}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-slate-500 sm:text-sm">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
