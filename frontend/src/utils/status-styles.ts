import type { JobStatus, JobUrlStatus } from '../types/jobs';

const STYLES: Record<string, string> = {
  pending: 'bg-paper-dark text-brown border-brown',
  in_progress: 'bg-retro-blue text-paper border-retro-blue',
  success: 'bg-retro-green text-paper border-retro-green',
  completed: 'bg-retro-green text-paper border-retro-green',
  error: 'bg-retro-red text-paper border-retro-red',
  failed: 'bg-retro-red text-paper border-retro-red',
  cancelled: 'bg-brown text-paper border-brown',
};

export function statusStyles(status: JobStatus | JobUrlStatus): string {
  return STYLES[status] ?? STYLES.pending;
}
