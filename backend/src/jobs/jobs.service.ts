import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './jobs.types';

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();

  create(dto: CreateJobDto): Job {
    const job: Job = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      urls: dto.urls.map((url) => ({
        url,
        status: 'pending',
      })),
    };

    this.jobs.set(job.id, job);

    return job;
  }
}
