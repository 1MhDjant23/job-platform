import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    CompaniesService,
    PrismaService
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService]
})
export class ApplicationsModule {}
