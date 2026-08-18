import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Job[] {
    return Array.from(this.jobs.values());
  }
  findOne(id: string): Job {
    const job = this.jobs.get(id);

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    return job;
  }

  cancel(id: string): Job {
    const job = this.jobs.get(id);

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    if (job.status === 'completed' || job.status === 'cancelled' || job.status === 'failed') {
      return job;
    }

    job.status = 'cancelled';

    for (const url of job.urls) {
      if (url.status === 'pending') {
        url.status = 'cancelled';
      }
    }

    return job;
  }
}
