import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsProcessor } from './jobs.processor';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsProcessor]
})
export class JobsModule {}
