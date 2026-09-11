import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import {
    ConflictException
}   from    '@nestjs/common';


@Injectable()
export class CompaniesService {
    constructor(private readonly    prisma: PrismaService) {}
/*******    *********** ******** */
/**         CREATE-COMPANY       */
/*******    *********** ******** */
    async   create(userId: string, dto: CreateCompanyDto) {
        const   existing = await this.findCompanyByOwnerId(userId); // one employer = one company
        if(existing) {
            throw new ConflictException('You already have a company profile');
        }
        return await this.prisma.company.create({
            data: {...dto, ownerId: userId},
            include: { owner: { select: { id: true, email: true, firstName: true } } }
        });
    }
/*******    *********** ******** */
/**         UPDATE-COMPANY       */
/*******    *********** ******** */
    async update(updatePayload: UpdateCompanyDto, ownerId: string) {
        // console.log("++++++++: ", Object.values(updatePayload).length);
        // if(Object.keys(updatePayload).length === 0) {
        //     throw new BadRequestException('At least one company field is required');
        // }
        const   company = await this.findCompanyByOwnerId(ownerId);
        if(!company) {
            throw new NotFoundException("You don't have company yet");
        }
        return await this.prisma.company.update({
            where: {id: company.id},
            data: updatePayload
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
