import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  // imports: [JobsModule]
})

export class CompaniesModule {}
