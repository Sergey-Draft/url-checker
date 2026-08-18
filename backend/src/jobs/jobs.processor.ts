import { Injectable } from '@nestjs/common';
import { Job, JobUrl } from './jobs.types';

@Injectable()
export class JobsProcessor {
  async process(job: Job): Promise<void> {
    job.status = 'in_progress';

    const pendingUrls = job.urls.filter(item => item.status === 'pending');

    let nextIndex = 0;

    const worker = async (): Promise<void> => {
      while (nextIndex < pendingUrls.length) {
        if (this.isCancelled(job)) {
          return;
        }

        const currentIndex = nextIndex;
        nextIndex += 1;

        await this.processUrl(job, pendingUrls[currentIndex]);
      }
    };

    const workers = Array.from({ length: Math.min(5, pendingUrls.length) }, () => worker());

    await Promise.all(workers);

    if (!this.isCancelled(job)) {
      job.status = 'completed';
    }
  }

  private isCancelled(job: Job): boolean {
    return job.status === 'cancelled';
  }

  private async processUrl(job: Job, url: JobUrl): Promise<void> {
    url.status = 'in_progress';
    url.startedAt = new Date().toISOString();

    try {
      const response = await fetch(url.url, {
        method: 'HEAD',
        redirect: 'manual'
      });

      url.httpStatus = response.status;

      await this.delay();

      url.status = 'success';
    } catch (error) {
      await this.delay();

      url.status = 'error';
      url.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      url.finishedAt = new Date().toISOString();

      if (url.startedAt) {
        url.duration = new Date(url.finishedAt).getTime() - new Date(url.startedAt).getTime();
      }
    }
  }

  private async delay(): Promise<void> {
    const milliseconds = Math.floor(Math.random() * 10_001);

    await new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
}
