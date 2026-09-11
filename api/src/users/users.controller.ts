import { 
    Controller,
    Get,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    Param
 } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Roles(Role.Admin, Role.Employer, Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Get('me')
    getProfile(@CurrentUser() user: CurrentUserPayload) {
        console.log("=======> After access GUARD =========");
        return user;
    }
    /*******    *********** ******** */
    @Get() 
    @Roles(Role.Admin)
    @UseGuards(JwtAccessGuard, RolesGuard)
    findAllUsers() {
        // Get all users exclude Admin
        return this.userService.allUsers();
    }
    /*******    *********** ******** */ 
    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(JwtAccessGuard, RolesGuard)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.delete(id);
    }


}
