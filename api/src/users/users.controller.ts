import { 
    Controller,
    Get,
    Req,
    UseGuards
 } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/types/users.types';

// type RequestWithUser = Request & {
//     user : { userId: string, type: string }
// }

@Controller('users')
export class UsersController {

    @UseGuards(JwtAccessGuard)
    @Get('me')
    getProfile(@CurrentUser() user: CurrentUserPayload) {
        console.log("=======> After access GUARD =========");
        return user;
    }

}
