import { STATUS_META, STATUS_ORDER, type ReadingStatus } from '@/types';

export type Filter = 'all' | ReadingStatus;

interface Props {
  active: Filter;
  counts: Record<Filter, number>;
  onChange: (filter: Filter) => void;
}

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'want', label: STATUS_META.want.label },
  { key: 'reading', label: STATUS_META.reading.label },
  { key: 'finished', label: STATUS_META.finished.label },
];

export function FilterTabs({ active, counts, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = counts[tab.key] ?? 0;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
              isActive
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
            ].join(' ')}
          >
            <span>{tab.label}</span>
            <span
              className={[
                'inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

