import { useEffect } from 'react';
import { getJob } from '../api/jobs-api';
import { useJobsStore } from '../store/jobs-store';

const TERMINAL_STATUSES = ['completed', 'cancelled', 'failed'];

export const POLL_INTERVAL_MS = 1000;

export function useJobPolling(): void {
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const activeJob = useJobsStore((state) => state.activeJob);

  const setActiveJob = useJobsStore((state) => state.setActiveJob);
  const setPolling = useJobsStore((state) => state.setPolling);

  useEffect(() => {
    if (!activeJobId) {
      setPolling(false);
      return;
    }

    if (
      activeJob &&
      TERMINAL_STATUSES.includes(activeJob.status)
    ) {
      setPolling(false);
      return;
    }

    setPolling(true);

    let cancelled = false;

    const poll = async (): Promise<void> => {
      try {
        const job = await getJob(activeJobId);

        if (cancelled) {
          return;
        }

        const currentJobId = useJobsStore.getState().activeJobId;

        if (currentJobId !== activeJobId) {
          return;
        }

        setActiveJob(job);
      } catch {
        // Keep polling. Temporary network errors should not stop the job monitor.
      }
    };

    void poll();

    const intervalId = window.setInterval(() => {
      void poll();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeJobId, activeJob?.status, setActiveJob, setPolling]);
}