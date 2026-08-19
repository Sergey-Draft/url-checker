import type { JobStatus, JobUrlStatus } from '../../types/jobs';
import { statusStyles } from '../../utils/status-styles';

interface StatusBadgeProps {
  status: JobStatus | JobUrlStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-sm border px-2 py-0.5 font-display text-xs tracking-wide uppercase ${statusStyles(status)}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
