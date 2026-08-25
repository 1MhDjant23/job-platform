import { 
    Controller,
    Get,
    Req,
    UseGuards
 } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';

type RequestWithUser = Request & {
    user : { userId: string, email: string }
}

@Controller('users')
export class UsersController {

    @UseGuards(JwtAccessGuard)
    @Get('me')
    getProfile(@Req() req: RequestWithUser) {
        return req.user;
    }

}
