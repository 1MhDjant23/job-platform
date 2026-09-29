import { 
    Controller,
    Get,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    Param,
    Patch,
    Body
 } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Patch('me')
    @Roles(Role.Employer, Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
    updateUserProfile(
        @Body() updateDto: UpdateUserDto,
        @CurrentUser() user: CurrentUserPayload
    ) {
        return ;
    }

    /*******    *********** ******** */
    @Get('me')
    @Roles(Role.Admin, Role.Employer, Role.JobSeeker)
    @UseGuards(JwtAccessGuard, RolesGuard)
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
