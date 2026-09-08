import { 
    Controller,
    Patch,
    UseGuards,
    Param,
    Body,
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

}
