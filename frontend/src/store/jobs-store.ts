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

  loadJobs: () => Promise<void>;
  selectJob: (id: string) => Promise<void>;
  createNewJob: (urls: string[]) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
  setActiveJob: (job: Job) => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  activeJob: null,
  isLoading: false,
  error: null,

  setActiveJob: (job) => {
    if (get().activeJobId !== job.id) {
      return;
    }
  
    set({
      activeJob: job,
    });
  },

  loadJobs: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
        
      const jobs = await getJobs();
      console.log('JOBS:', jobs);
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
      });
      console.log('CREATED JOB:', jobId);
      await get().loadJobs();
      console.log('JOB DETAILS:', job);
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
      });

      await get().loadJobs();
    } catch {
      set({
        error: 'Failed to cancel job',
      });
    }
  },
}));