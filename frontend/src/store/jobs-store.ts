import { create } from 'zustand';
import {
  cancelJob,
  createJob,
  getJob,
  getJobs,
} from '../api/jobs-api';
import type { Job, JobSummary } from '../types/jobs';

interface JobsState {
  jobs: JobSummary[];
  activeJobId: string | null;
  activeJob: Job | null;
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
  isPolling: boolean;

  loadJobs: () => Promise<void>;
  refreshJobs: () => Promise<void>;
  selectJob: (id: string) => Promise<void>;
  createNewJob: (urls: string[]) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
  setActiveJob: (job: Job) => void;
  setPolling: (isPolling: boolean) => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  activeJob: null,
  isLoading: false,
  error: null,
  lastUpdatedAt: null,
  isPolling: false,

  setActiveJob: (job) => {
    if (get().activeJobId !== job.id) {
      return;
    }

    set({
      activeJob: job,
      lastUpdatedAt: new Date().toISOString(),
    });
  },

  setPolling: (isPolling) => {
    set({ isPolling });
  },

  loadJobs: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const jobs = await getJobs();

      set({
        jobs,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: 'Failed to load jobs',
      });
    }
  },

  refreshJobs: async () => {
    try {
      const jobs = await getJobs();

      set({ jobs });
    } catch {
      // Silent background refresh: keep the previously loaded list on failure.
    }
  },

  selectJob: async (id) => {
    set({
      activeJobId: id,
      activeJob: null,
      isLoading: true,
      error: null,
    });

    try {
      const job = await getJob(id);

      if (get().activeJobId !== id) {
        return;
      }

      set({
        activeJob: job,
        isLoading: false,
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch {
      if (get().activeJobId !== id) {
        return;
      }

      set({
        isLoading: false,
        error: 'Failed to load job',
      });
    }
  },

  createNewJob: async (urls) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const { jobId } = await createJob(urls);

      const job = await getJob(jobId);

      set({
        activeJobId: jobId,
        activeJob: job,
        isLoading: false,
        lastUpdatedAt: new Date().toISOString(),
      });
      await get().loadJobs();
    } catch {
      set({
        isLoading: false,
        error: 'Failed to create job',
      });
    }
  },

  cancelActiveJob: async () => {
    const { activeJobId } = get();

    if (!activeJobId) {
      return;
    }

    try {
      const job = await cancelJob(activeJobId);

      if (get().activeJobId !== activeJobId) {
        return;
      }

      set({
        activeJob: job,
        lastUpdatedAt: new Date().toISOString(),
      });

      await get().loadJobs();
    } catch {
      set({
        error: 'Failed to cancel job',
      });
    }
  },
}));