import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './dto/jobs.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company, JobStatus, JobType } from '@prisma/client';
import { ApplicationsService } from 'src/applications/applications.service';

@Injectable()
export class JobsService {
    constructor(
        private readonly companyService: CompaniesService,
        private readonly prisma: PrismaService,
        private readonly appService: ApplicationsService
    ) {}
    /*******    *********** ******** */
    async   create(dto: CreateJobDto, ownerId: string) {
        const   company = await this.validCompany(ownerId);
        return this.prisma.jobs.create({
            data: {
                ...dto,
                companyId: company.id
            }
        });
    }
    /*******    *********** ******** */
    async update(dto: UpdateJobDto, ownerId: string, jobId: string) {
        const   company = await this.validCompany(ownerId);
        this.prisma.jobs.update({
            where: {companyId: company.id, id: jobId},
            data: dto
        })
    }
    /*******    *********** ******** */
    async updateStatus(data: {jobId: string, status: JobStatus, ownerId: string}) {
        // const   exist = await this.prisma.jobs.findUnique({
        //     where: {id: data.jobId},
        //     include: {company: true}
        // });
        // if(!exist) {
        //     throw new NotFoundException('Job not found');
        // }
        // if(exist.company.ownerId !== data.ownerId) {
        //     throw new ConflictException('Company/Jobs conflict');
        // }
        await this.validateJob(data.jobId, data.ownerId);
        return await this.prisma.jobs.update({
            where: {id: data.jobId},
            data: {status: data.status}
        })
    }
    /*******    *********** ******** */
    async updateJobType(data: {jobId: string, type: JobType, ownerId: string}) {

        await this.validateJob(data.jobId, data.ownerId);
        return await this.prisma.jobs.update({
            where: {id: data.jobId},
            data: {type: data.type}
        })
    }
    /*******    *********** ******** */
    async allJobs() {
        return await this.prisma.jobs.findMany({
            select: {id: true, title: true, status: true, type: true}
        });
    }
    /*******    *********** ******** */
    async oneJob(jobId: string) {
        return await this.prisma.jobs.findUnique({
            where: { id: jobId }
        });
    }
    /*******    *********** ******** */
    async delete(jobId: string, ownerId: string) {
        await this.validateJob(jobId, ownerId);
        return this.prisma.jobs.delete({
            where: {id: jobId}
        });
    }  
    /*******    *********** ******** */
    async getMine(ownerId: string) {
        const   company = await this.validCompany(ownerId);
        return this.prisma.jobs.findMany({
            where: {companyId: company.id}
        });
    }
    /*******    *********** ******** */
    async getApplications(employerId: string, jobId: string) {
        const   isMatch = await this.prisma.jobs.findFirst({
            where: {
                id: jobId,
                company: {ownerId: employerId}
            },
            select: {id: true}
        });
        if(!isMatch) {
            throw new ConflictException("Job dose not belong to your company");
        }
        return await this.appService.findApplicationsByJobId(jobId);
    }
    /*******    *********** ******** */
    async   validateJob(jobId: string, ownerId: string) {
        const   exist = await this.prisma.jobs.findUnique({
            where: {id: jobId},
            include: {company: true}
        });
        if(!exist) {
            throw new NotFoundException('Job not found');
        }
        if(exist.company.ownerId !== ownerId) {
            throw new ConflictException('Company/Jobs conflict');
        }
    }    
    /*******    *********** ******** */
    async   validCompany(ownerId: string) : Promise<Company> {
        const   company = await this.companyService.findCompanyByOwnerId(ownerId);
        if(!company) {
            throw new ConflictException('You don\'t have company profile');
        }
        if(!company.approved) {
            throw new ConflictException('Company profile still not verified');
        }
        return company;
    }
}
