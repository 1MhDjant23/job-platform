import { 
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    Delete,
    Put,
    UseInterceptors,
    Patch,
    ParseUUIDPipe,
    UploadedFile,
    BadRequestException
 } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiResponse } from 'src/common/interfaces/globale.response.types';
import { Company, CreateCompany } from '@job-platform/contracts';
import { toPublicCompany } from './mappers/company.mapper';


@Controller('companies')
export class CompaniesController {
    constructor(private readonly companyService: CompaniesService) {}
    
/*******    *********** ******** */
    // Create Company
    @Post()
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async createCompany(
        @CurrentUser() user: CurrentUserPayload, @Body() creatCompany: CreateCompanyDto
    ) : Promise<ApiResponse<CreateCompany>> {

        const createdCompany = await this.companyService.create(user.userId, creatCompany);
        
        return {
            data: toPublicCompany(createdCompany)
        };
    }
/*******    *********** ******** */
    // Update Company 
    @Patch()
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async updateCompany(
        @Body() updatePayload: UpdateCompanyDto , @CurrentUser() user: CurrentUserPayload
    ) : Promise<ApiResponse<Company>> {
        const updatedCompany = await this.companyService.update(updatePayload, user.userId);
        
        return {
            data: toPublicCompany(updatedCompany)
        }
    }

/*******    *********** ******** */
    // Get employer company
    @Get('mine')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async getOwnCompany(@CurrentUser() user: CurrentUserPayload): Promise<ApiResponse<Company>> {

        // return this.companyService.findCompanyByOwnerId(user.userId);
        return {
            data: toPublicCompany(await this.companyService.findCompanyByOwnerId(user.userId))
        }
    }
/*******    *********** ******** */
    // Delete company
    @Delete('me')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async   deleteCompany(@CurrentUser() user: CurrentUserPayload) {
        return toPublicCompany(await this.companyService.deleteCompany(user.userId));
    }
/*******    *********** ******** */
    // Get Company by ID, public
    @Get(':id')
    async getCompany(@Param('id') companyId: string) {
        return toPublicCompany(await this.companyService.getCompanyId(companyId));
    }
/*******    *********** ******** */
    // Admin approve a company
    @Patch(':id/approve')
    @Roles(Role.Admin)
    @UseGuards(JwtAccessGuard, RolesGuard)
    approveCompany(@Param('id', ParseUUIDPipe) id: string) {
        return this.companyService.approve(id).then(toPublicCompany);
    }
/*******    *********** ******** */
    // Upload logo
    // @Post('me/logo')
    // @Roles(Role.Employer)
    // @UseGuards(JwtAccessGuard, RolesGuard)
    // uploadLogo(
    //     @CurrentUser() user: CurrentUserPayload
    // ) {
    //     console.log("----------------------");
    //     if(!file)
    //     {
    //         throw new BadRequestException("upload a logo");
    //     }
    //     console.log(file)
    //     return "Logo of company";
    // }

}
