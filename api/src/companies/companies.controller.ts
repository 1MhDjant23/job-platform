import { 
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    Delete,
    Put,
    Patch
 } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companyService: CompaniesService) {}
    
    @Post()
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async createCompany(@CurrentUser() user: CurrentUserPayload, @Body() creatCompany: CreateCompanyDto) {
        return await this.companyService.create(user.userId, creatCompany);
    }
/*******    *********** ******** */
    @Patch()
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async updateCompany(@Body() updatePayload: UpdateCompanyDto , @CurrentUser() user: CurrentUserPayload) {
        return await this.companyService.update(updatePayload, user.userId);
    }

/*******    *********** ******** */
    @Get('me')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async getOwnCompany(@CurrentUser() user: CurrentUserPayload) {
        return this.companyService.findCompanyByOwnerId(user.userId);
    }
/*******    *********** ******** */

    @Delete('me')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async   deleteCompany(@CurrentUser() user: CurrentUserPayload) {
        return await this.companyService.deleteCompany(user.userId);
    }
/*******    *********** ******** */
    @Get(':id')
    async getCompany(@Param('id') companyId: string) {
        return await this.companyService.getCompanyId(companyId);
    }
/*******    *********** ******** */
    @Patch(':id/approve')
    @Roles(Role.Admin)
    @UseGuards(JwtAccessGuard, RolesGuard)
    approveCompany(@Param() id: string) {
        return this.companyService.approve(id);
    }
/*******    *********** ******** */
    @Post('me/logo')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async uploadLogo() {
        return "Logo of company";
    }

}
