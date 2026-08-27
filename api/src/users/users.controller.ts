import { 
    Controller,
    Get,
    Req,
    UseGuards
 } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guards';

type RequestWithUser = Request & {
    user : { userId: string, type: string }
}

@Controller('users')
export class UsersController {

    @UseGuards(JwtAccessGuard)
    @Get('me')
    getProfile(@Req() req: RequestWithUser) {
        console.log("=======> After access GUARD =========");
        return req.user;
    }

}
