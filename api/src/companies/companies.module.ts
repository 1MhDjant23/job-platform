import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    UploadService
  ],
})

export class CompaniesModule {}
