import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
    ConflictException
}   from    '@nestjs/common';


@Injectable()
export class CompaniesService {
    constructor(private readonly    prisma: PrismaService) {}
/*******    *********** ******** */
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
    async   findCompanyByOwnerId(ownerId: string ) {
        return await this.prisma.company.findUnique({
            where: { ownerId: ownerId }
        });
    }
/*******    *********** ******** */
/*******    *********** ******** */
/**         CREATE-COMPANY       */
/*******    *********** ******** */

}
