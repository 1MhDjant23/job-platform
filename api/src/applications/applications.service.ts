import { ConflictException, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationsService {
    constructor(
        private readonly companyService: CompaniesService,
        private readonly prisma: PrismaService
    ) {}

    async updateStatus(employerId: string, applicationId: string, status: ApplicationStatus) {

        const company = await this.companyService.findCompanyByOwnerId(employerId);
        if(!company) {
            throw new ConflictException("You don't have a profile company");
        }
        const   application = await this.prisma.application.findFirst({
            where: {
                id: applicationId,
                job: {
                    companyId: company.id
                }
             }
        });
        if(!application) {
            throw new ConflictException("Application does not belong to you're company");
        }

    }
}
