import {
        Controller, 
        Post, 
        Body,
        UseGuards,
        NotImplementedException, 
        HttpStatus, 
        HttpCode,
        Get,
        Res,
        Req,
        } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, signUpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshGuard } from './guards/jwt-refresh.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/common/types/users.types';
import { Role } from '@prisma/client';

export type    RefreshPayload = { userId: string, refreshTokenId: string, role: Role };

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly confgService: ConfigService
    ) {}
/*******    *********** ******** */
/*******    *********** ******** */

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() input: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const   authResult = await this.authService.authenticate(input);
        
        res.cookie('refreshToken', authResult.refreshToken, {
            httpOnly: true,
            secure: this.confgService.getOrThrow<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            data : {
                user: authResult.user,
                accessToken: authResult.accessToken
            }
        } 
    }
/*******    *********** ******** */
    @Post('signup')
    signUp(@Body() input: signUpDto) {
        return this.authService.signup(input);
    }
/*******    *********** ******** */
    @Get('refresh')
    @UseGuards(JwtRefreshGuard)
    async getRefreshToken(@CurrentUser() u: RefreshPayload, @Res({ passthrough: true }) res: Response) {
        const   { accessToken, refreshToken, user } = await this.authService.refresh(u)
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: true,
            secure: this.confgService.getOrThrow<string>('NODE_ENV') === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            data: {
                accessToken: accessToken,
                user
            }
        };
    }

}
