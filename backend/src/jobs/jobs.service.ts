import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsProcessor } from './jobs.processor';
import { randomUUID } from 'crypto';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './jobs.types';

@Injectable()
export class JobsService {
  constructor(private readonly jobsProcessor: JobsProcessor) {}
  private readonly jobs = new Map<string, Job>();

  create(dto: CreateJobDto): Job {
    const job: Job = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      urls: dto.urls.map(url => ({
        url,
        status: 'pending'
      }))
    };

    this.jobs.set(job.id, job);

    void this.jobsProcessor.process(job);

    return job;
  }

  findAll() {
    return Array.from(this.jobs.values()).map(job => {
      const successCount = job.urls.filter(url => url.status === 'success').length;

      const errorCount = job.urls.filter(url => url.status === 'error').length;

      return {
        id: job.id,
        createdAt: job.createdAt,
        status: job.status,
        urlCount: job.urls.length,
        successCount,
        errorCount
      };
    });
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
