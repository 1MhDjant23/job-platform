import { 
    Controller,
    Get,
    Post,
    Body,
    UseGuards
 } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
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
    @Get('viewCompany')
    getCompany() {
        return "view company";
    }

}
