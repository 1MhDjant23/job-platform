import { 
    Controller,
    Post,
    Body,
    UseGuards,
    Patch,
    Param
 } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './dto/jobs.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JobStatus, Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService: JobsService) {}
    
    /*******    *********** ******** */
    @Post()
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    createJob(@Body() createJobDto: CreateJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.create(createJobDto, user.userId);
    }
    /*******    *********** ******** */
    @Patch(':id')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateJob(@Param() jobId: string, @Body() updateJobDto: UpdateJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.update(updateJobDto, user.userId, jobId);
    }
    /*******    *********** ******** */
    @Patch('id')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateStatus(
        @Param('id')    id: string,
        @CurrentUser()  user: CurrentUserPayload,
        @Body()         dto: { status: JobStatus }
    ){
        return this.jobService.updateStatus({ownerId: user.userId, status: dto.status, jobId: id});
    }
    /*******    *********** ******** */
        @Patch('id')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateJobType(
        @Param('id')    id: string,
        @CurrentUser()  user: CurrentUserPayload,
        @Body()         dto: { jobType: JobStatus }
    ){
        return this.jobService.updateJobType({ownerId: user.userId, status: dto.jobType, jobId: id});
    }


}
