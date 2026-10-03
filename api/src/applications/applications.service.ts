import {
    ConflictException,
    Injectable,
    ForbiddenException,
    NotFoundException
    } from '@nestjs/common';
import { Application, ApplicationStatus } from '@prisma/client';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplyToJobDto } from './dto/apply.to.job.dto';
import type { Application as PublicApplication } from '@job-platform/contracts';
import { publicApplicationSelect, toPublicApplication } from './mappers/application.mapper';

@Injectable()
export class ApplicationsService {
    constructor(
        private readonly companyService: CompaniesService,
        private readonly prisma: PrismaService
    ) {}
    /*******    *********** ******** */
    //          As Employer 
    /*******    *********** ******** */
    async updateStatus(
        employerId: string,
         applicationId: string,
          status: ApplicationStatus
        ) {

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
        return await this.prisma.application.update({
            where: {id: applicationId},
            data: {status: status}
        });
    }
    /*******    *********** ******** */
    //          As JobSeeker 
    /*******    *********** ******** */
    async findApplications(jobSeekerId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id:  jobSeekerId },
            select: {
                applications: {
                    select: publicApplicationSelect,
                    orderBy: {
                        appliedAt: 'desc',
                    }
                }
            }
        });
        return user?.applications.map(toPublicApplication) ?? [];
    }
    /*******    *********** ******** */
    async apply(applyData: ApplyToJobDto, jobSeekerId: string): Promise<PublicApplication> {
        const   exist = await this.prisma.jobs.findUnique({
            where: { id: applyData.jobId },
            select: {
                applicants: {
                    select: { id: true, applicantId: true, jobId: true }
                }
            }
        });
        if(!exist) {
            throw new NotFoundException("Job not found");
        }
        //chek if already applied to this job
        const   isApplied = exist.applicants.find(app => app.applicantId === jobSeekerId);
        if(isApplied) {
            throw new ConflictException("Application already sent");
        }
        return await this.prisma.application.create({
            data: {
                coverLeter: applyData.coverLetter,
                jobId: applyData.jobId,
                applicantId: jobSeekerId
            },
            select: publicApplicationSelect,
        }).then(toPublicApplication);
    }
    /*******    *********** ******** */
    async delete(appId: string, jobSeekerId: string) {
        const   appMatch = await this.prisma.application.findUnique({
            where: {
                id: appId,
                applicantId: jobSeekerId
            },
            select: { id: true, status: true }
        });
        if (!appMatch) {
            throw new ConflictException("Application dose not belong to you're profile");
        }
        if(appMatch.status !== 'Applied') {
            throw new ForbiddenException('Can\'t withdraw application that already Reviewed');
        }
        return await this.prisma.application.delete({
            where: {
                id: appId
            }
        });
    }

    /*******    *********** ******** */
    async   findApplicationsByJobId(jobId: string) : Promise<Application[]> {
        return this.prisma.application.findMany({
            where: {jobId: jobId}
        })
    }
}
