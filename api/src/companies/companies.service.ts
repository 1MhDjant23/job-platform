import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import {
    ConflictException
}   from    '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';

export interface Company {
    id:          string;
    name:        string;
    description: string | null;
    location:    string | null;
    website:     string | null;
    logoUrl:     string | null;
    ownerId:     string;
}

@Injectable()
export class CompaniesService {
    constructor(
        private readonly    prisma: PrismaService,
        private readonly    uploadService: UploadService
    ) {}
/*******    *********** ******** */
/**         CREATE-COMPANY       */
/*******    *********** ******** */
    async   create(userId: string, dto: CreateCompanyDto) : Promise<Company> {
        const   existing = await this.findCompanyByOwnerId(userId); // one employer = one company
        if(existing) {
            throw new ConflictException('You already have a company profile');
        }
        return await this.prisma.company.create({
            data: {...dto, ownerId: userId},
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                website: true,
                logoUrl: true,
                ownerId: true
            }
        });
    }
/*******    *********** ******** */
/**         UPDATE-COMPANY       */
/*******    *********** ******** */
    async update(updatePayload: UpdateCompanyDto, ownerId: string): Promise<Company> {
        // if(Object.keys(updatePayload).length === 0) {
        //     throw new BadRequestException('At least one company field is required');
        // }
        const   company = await this.findCompanyByOwnerId(ownerId);
        if(!company) {
            throw new NotFoundException("You don't have company yet");
        }
        // removing OLLD logo from the Disk
        if(updatePayload.logoUrl && updatePayload.logoUrl !== company.logoUrl) {
            this.uploadService.deleteFile(updatePayload.logoUrl);
        }
        return await this.prisma.company.update({
            where: {id: company.id},
            data: updatePayload,
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                website: true,
                logoUrl: true,
                ownerId: true
            }
        });
    }
/*******    *********** ******** */

    async   findCompanyByOwnerId(ownerId: string ) {
        const   exist = await this.prisma.company.findUnique({
            where: { ownerId: ownerId }
        });
        // if(!exist) {
        //     throw new NotFoundException("You don't have company yet");
        // }
        return exist;
    }
/*******    *********** ******** */
    async deleteCompany(ownerId: string) {
        return this.prisma.company.delete({
            where: {
                ownerId: ownerId
            }
        })
    }
/*******    *********** ******** */
    async   getCompanyId(id: string) {
        const   exist = await this.prisma.company.findUnique({
            where: { id: id },
            include: { owner: { select: {firstName: true, lastName: true} } }
        });
        if(!exist) {
            throw new NotFoundException('Company not found');
        }
        return exist;
    }
/*******    *********** ******** */
    async approve(companyId: string) {
        const   exist = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true }
        });
        if(exist) {
            throw new NotFoundException('Company not found');
        }
        return await this.prisma.company.update({
            where: {id: companyId},
            data: { approved: true }
        });
    }
/*******    *********** ******** */
/*******    *********** ******** */
/**         CREATE-COMPANY       */
/*******    *********** ******** */

}
