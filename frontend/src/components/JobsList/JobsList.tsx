import type { JobSummary } from '../../types/jobs';
import { StatusBadge } from '../StatusBadge/StatusBadge';

interface JobsListProps {
  jobs: JobSummary[];
  activeJobId: string | null;
  onSelect: (id: string) => Promise<void>;
}

export function JobsList({
  jobs,
  activeJobId,
  onSelect,
}: JobsListProps) {
  return (
    <div className="border-2 border-brown bg-paper-dark/40 p-4 shadow-[4px_4px_0_var(--color-brown)]">
      <h2 className="mb-3 font-display text-lg text-brown-dark">Jobs</h2>

      {jobs.length === 0 && (
        <p className="text-sm text-brown">No jobs yet — run a check above.</p>
      )}

      <ul className="flex flex-col gap-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <button
              type="button"
              onClick={() => void onSelect(job.id)}
              className={`w-full cursor-pointer border-2 px-3 py-2 text-left transition-colors ${
                job.id === activeJobId
                  ? 'border-retro-blue bg-retro-blue/10'
                  : 'border-brown/40 bg-paper hover:border-brown'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-brown-dark">
                  {job.id}
                </span>
                <StatusBadge status={job.status} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-brown">
                <span>{new Date(job.createdAt).toLocaleString()}</span>
                <span>
                  {job.urlCount} urls · {job.successCount} ok · {job.errorCount} err
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
