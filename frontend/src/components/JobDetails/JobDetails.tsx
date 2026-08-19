import type { Job } from '../../types/jobs';

interface JobDetailsProps {
  job: Job | null;
  isLoading: boolean;
  onCancel: () => Promise<void>;
}

export function JobDetails({
  job,
  isLoading,
  onCancel,
}: JobDetailsProps) {
  if (isLoading && !job) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Select a job</div>;
  }

  return (
    <div>
      <h2>Job details</h2>

      <p>Status: {job.status}</p>
      <p>
        Progress:{' '}
        {
          job.urls.filter(
            (url) =>
              url.status !== 'pending' &&
              url.status !== 'in_progress',
          ).length
        }{' '}
        / {job.urls.length}
      </p>

      {job.status !== 'completed' &&
        job.status !== 'cancelled' &&
        job.status !== 'failed' && (
          <button type="button" onClick={() => void onCancel()}>
            Cancel job
          </button>
        )}

      {job.urls.map((url) => (
        <div key={`${url.url}-${url.startedAt ?? 'pending'}`}>
          <strong>{url.url}</strong>
          {' — '}
          {url.status}
          {url.httpStatus ? ` (${url.httpStatus})` : ''}
          {url.error ? ` — ${url.error}` : ''}
        </div>
      ))}
    </div>
  );
}