import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { CompaniesModule } from 'src/companies/companies.module';
import { CompaniesService } from 'src/companies/companies.service';
import { ApplicationsService } from 'src/applications/applications.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  providers: [
    JobsService,
    CompaniesService,
    ApplicationsService,
    UploadService
  ],
  controllers: [JobsController]
})
export class JobsModule {}
