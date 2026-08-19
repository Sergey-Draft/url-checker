import type { JobSummary } from '../../types/jobs';

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
    console.log('JobsList jobs:', jobs);
  return (
    <div>
      <h2>Jobs</h2>

      {jobs.map((job) => (
        <button
          key={job.id}
          type="button"
          onClick={() => void onSelect(job.id)}
        >
          {job.id} — {job.status}
          {job.id === activeJobId ? ' ← active' : ''}
        </button>
      ))}
    </div>
  );
}