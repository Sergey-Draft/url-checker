export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type JobUrlStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'error'
  | 'cancelled';

export interface JobUrl {
  url: string;
  status: JobUrlStatus;
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

export interface JobSummary {
  id: string;
  createdAt: string;
  status: JobStatus;
  urlCount: number;
  successCount: number;
  errorCount: number;
}

export interface CreateJobResponse {
  jobId: string;
}