export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type UrlStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface JobUrl {
  url: string;
  status: UrlStatus;
  httpStatus?: number;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
}

export interface Job {
  id: string;
  createdAt: string;
  status: JobStatus;
  urls: JobUrl[];
}
