import type { Job } from '../../types/jobs';
import { StatusBadge } from '../StatusBadge/StatusBadge';

interface JobDetailsProps {
  job: Job | null;
  isLoading: boolean;
  onCancel: () => Promise<void>;
}

const TERMINAL_JOB_STATUSES = ['completed', 'cancelled', 'failed'];

export function JobDetails({
  job,
  isLoading,
  onCancel,
}: JobDetailsProps) {
  if (isLoading && !job) {
    return (
      <div className="border-2 border-brown bg-paper-dark/40 p-4 text-brown shadow-[4px_4px_0_var(--color-brown)]">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="border-2 border-brown bg-paper-dark/40 p-4 text-brown shadow-[4px_4px_0_var(--color-brown)]">
        Select a job to see its details.
      </div>
    );
  }

  const processed = job.urls.filter(
    (url) => url.status !== 'pending' && url.status !== 'in_progress',
  ).length;
  const total = job.urls.length;
  const progressPercent = total === 0 ? 0 : Math.round((processed / total) * 100);

  return (
    <div className="border-2 border-brown bg-paper-dark/40 p-4 shadow-[4px_4px_0_var(--color-brown)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg text-brown-dark">Job details</h2>
        <StatusBadge status={job.status} />
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-brown">
          <span>Progress</span>
          <span>
            {processed} / {total}
          </span>
        </div>
        <div className="h-3 w-full border border-brown bg-paper">
          <div
            className="h-full bg-mustard transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!TERMINAL_JOB_STATUSES.includes(job.status) && (
        <button
          type="button"
          onClick={() => void onCancel()}
          className="mb-3 cursor-pointer border-2 border-retro-red bg-retro-red px-3 py-1.5 font-display text-sm text-paper transition-transform hover:-translate-y-0.5"
        >
          Cancel job
        </button>
      )}

      <ul className="flex flex-col gap-1.5">
        {job.urls.map((url, index) => (
          <li
            key={`${index}-${url.url}`}
            className="border border-brown/30 bg-paper px-2.5 py-1.5 text-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-ink">{url.url}</span>
              <StatusBadge status={url.status} />
            </div>
            {(url.httpStatus || url.error || url.duration) && (
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-brown">
                {url.httpStatus && <span>HTTP {url.httpStatus}</span>}
                {url.error && <span className="text-retro-red">{url.error}</span>}
                {url.duration != null && <span>{url.duration}ms</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
