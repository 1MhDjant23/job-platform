import { 
    Controller,
    Patch,
    Get,
    UseGuards,
    Param,
    Delete,
    Body,
    Post,
    ParseUUIDPipe,
    ParseEnumPipe
 } from '@nestjs/common';
import { ApplicationStatus, Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { ApplicationsService } from './applications.service';
import { ApplyToJobDto } from './dto/apply.to.job.dto';
import { Application as PublicApplication, ApiResponse } from '@job-platform/contracts';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly appService: ApplicationsService) {}

    /*******    *********** ******** */
    //          As Employer 
    /*******    *********** ******** */
    @Patch(':id/status')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateApplicationStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status', new ParseEnumPipe(ApplicationStatus)) status: ApplicationStatus,
        @CurrentUser() user: CurrentUserPayload
    ){
        return this.appService.updateStatus(user.userId, id, status);
    }

    /*******    *********** ******** */
    //          As JobSeeker 
    /*******    *********** ******** */
    @Get('mine')
    @Roles(Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    findAllApplications(
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.appService.findApplications(user.userId);
    }
    /*******    *********** ******** */
    @Post()
    @Roles(Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async apply(
        @CurrentUser() user: CurrentUserPayload,
        @Body() applyData: ApplyToJobDto
    ) : Promise<ApiResponse<PublicApplication>> { 
        return  {
            data: await this.appService.apply(applyData, user.userId)
        };
    }    
    /*******    *********** ******** */
    @Delete(':id')
    @Roles(Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    deleteApplication(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: CurrentUserPayload
    ) {
        return this.appService.delete(id, user.userId);
    }


}
