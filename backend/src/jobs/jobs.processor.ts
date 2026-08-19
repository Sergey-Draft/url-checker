import { Injectable } from '@nestjs/common';
import { Job, JobUrl } from './jobs.types';

const REQUEST_TIMEOUT_MS = 8_000;

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

        await this.processUrl(pendingUrls[currentIndex]);
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

  private async processUrl(url: JobUrl): Promise<void> {
    url.status = 'in_progress';
    url.startedAt = new Date().toISOString();

    let httpStatus: number | undefined;
    let errorMessage: string | undefined;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(url.url, {
          method: 'HEAD',
          redirect: 'manual',
          signal: controller.signal
        });

        httpStatus = response.status;
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      errorMessage =
        error instanceof Error && error.name === 'AbortError'
          ? 'Request timed out'
          : error instanceof Error
            ? error.message
            : 'Unknown error';
    }

    await this.delay();

    url.finishedAt = new Date().toISOString();
    url.duration = new Date(url.finishedAt).getTime() - new Date(url.startedAt).getTime();

    if (errorMessage) {
      url.status = 'error';
      url.error = errorMessage;
    } else {
      url.status = 'success';
      url.httpStatus = httpStatus;
    }
  }

  private async delay(): Promise<void> {
    const milliseconds = Math.floor(Math.random() * 10_001);

    await new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
}
