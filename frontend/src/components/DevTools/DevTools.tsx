import { useState } from 'react';
import { useJobsStore } from '../../store/jobs-store';
import { POLL_INTERVAL_MS } from '../../hooks/useJobPolling';

const CONCURRENCY_LIMIT = 5;

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const activeJob = useJobsStore((state) => state.activeJob);
  const isPolling = useJobsStore((state) => state.isPolling);
  const lastUpdatedAt = useJobsStore((state) => state.lastUpdatedAt);

  const pending = activeJob?.urls.filter((url) => url.status === 'pending').length ?? 0;
  const active = activeJob?.urls.filter((url) => url.status === 'in_progress').length ?? 0;
  const success = activeJob?.urls.filter((url) => url.status === 'success').length ?? 0;
  const error = activeJob?.urls.filter((url) => url.status === 'error').length ?? 0;
  const cancelled = activeJob?.urls.filter((url) => url.status === 'cancelled').length ?? 0;
  const total = activeJob?.urls.length ?? 0;

  return (
    <div className="border-2 border-brown bg-paper-dark/40 shadow-[4px_4px_0_var(--color-brown)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full cursor-pointer px-4 py-2 text-left font-display text-sm text-brown-dark"
      >
        {isOpen ? '▾' : '▸'} Developer tools
      </button>

      {isOpen && (
        <div className="border-t-2 border-brown p-4 font-mono text-sm">
          {!activeJob ? (
            <p className="text-brown">Select or start a job to inspect it.</p>
          ) : (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <Row label="Job ID" value={activeJob.id} mono />
              <Row label="Status" value={activeJob.status} />
              <Row label="Progress" value={`${success + error + cancelled} / ${total}`} />

              <Divider>Concurrency</Divider>
              <Row label="Active requests" value={`${active} / ${CONCURRENCY_LIMIT}`} />
              <Row
                label="Slots"
                value={concurrencyDots(active, CONCURRENCY_LIMIT)}
              />
              <Row label="Pending in queue" value={String(pending)} />

              <Divider>Polling</Divider>
              <Row label="State" value={isPolling ? 'active' : 'stopped'} />
              <Row label="Interval" value={`${POLL_INTERVAL_MS} ms`} />
              <Row
                label="Last update"
                value={lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleTimeString() : '—'}
              />

              <Divider>Results</Divider>
              <Row label="Success" value={String(success)} />
              <Row label="Error" value={String(error)} />
              <Row label="Cancelled" value={String(cancelled)} />
            </dl>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt className="text-brown">{label}</dt>
      <dd className={`truncate text-ink ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </>
  );
}

function Divider({ children }: { children: string }) {
  return (
    <div className="col-span-2 mt-2 border-b border-brown/30 pb-1 font-display text-xs tracking-wide text-brown-dark uppercase">
      {children}
    </div>
  );
}

function concurrencyDots(active: number, limit: number): string {
  return `${'●'.repeat(active)}${'○'.repeat(Math.max(limit - active, 0))}`;
}
