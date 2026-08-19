import axios from 'axios';
import type {
  CreateJobResponse,
  Job,
  JobSummary,
} from '../types/jobs';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createJob(
  urls: string[],
): Promise<CreateJobResponse> {
  const { data } = await api.post<CreateJobResponse>('/jobs', { urls });

  return data;
}

export async function getJobs(): Promise<JobSummary[]> {
  const { data } = await api.get<JobSummary[]>('/jobs');

  return data;
}

export async function getJob(id: string): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${id}`);

  return data;
}

export async function cancelJob(id: string): Promise<Job> {
  const { data } = await api.delete<Job>(`/jobs/${id}`);

  return data;
}