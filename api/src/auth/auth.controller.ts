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

type    RefreshRequest = Request & {user: { userId: string, refreshTokenId: string }};

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
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            user: authResult.user,
            access_token: authResult.accessToken
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
    async getRefreshToken(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response) {
        const   { accessToken, refreshToken } = await this.authService.refresh(req.user)
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: true,
            secure: this.confgService.getOrThrow<string>('NODE_ENV') === 'production',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            accessToken: accessToken,
            userId: req.user.userId
        };
    }

}
