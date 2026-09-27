import { 
    Controller,
    Post,
    Body,
    UseGuards,
    Patch,
    Param,
    Delete,
    Get,
    ParseUUIDPipe,
    Query
} from '@nestjs/common';
import { CreateJobDto, GetJobsQueryDto, UpdateJobDto } from './dto/jobs.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Jobs, JobStatus, JobType, Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { JobsService } from './jobs.service';
import { PaginatedResponse } from 'src/common/interfaces/globale.response.types';
import { Job } from './jobs.types';

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
    @Patch(':id')
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
    @Patch(':id')
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateJobType(
        @Param('id')    id: string,
        @CurrentUser()  user: CurrentUserPayload,
        @Body()         dto: { jobType: JobType }
    ){
        return this.jobService.updateJobType({ownerId: user.userId, type: dto.jobType, jobId: id});
    }
    /*******    *********** ******** */
    @Get()
    getJobs(@Query() query: GetJobsQueryDto): Promise<PaginatedResponse<Job> > {
        return this.jobService.allJobs(query);
    }
    /*******    *********** ******** */
    @Get(':id') // get a single job by ID
    getOneJob(@Param('id') id: string) {
        return this.jobService.oneJob(id);
    }    
    /*******    *********** ******** */
    @Get('mine') // Get all my jobs
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    getMine(@CurrentUser() user: CurrentUserPayload) {
        return this.jobService.getMine(user.userId);
    }    
    /*******    *********** ******** */
    @Delete(':id') // delete a single job
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    deleteJob(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.delete(id, user.userId);
    }
    /*******    *********** ******** */
    @Get(':id/applications') // Get all applications for a single job
    @Roles(Role.Employer)
    @UseGuards(JwtAccessGuard, RolesGuard)
    getApplications(
        @CurrentUser() user: CurrentUserPayload,
        @Param('id', ParseUUIDPipe) id: string
    ) {

    }
}
