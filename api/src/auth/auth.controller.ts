import {
        Controller, 
        Post, 
        Body,
        NotImplementedException, 
        HttpStatus, 
        HttpCode,
        Res,
        } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, signUpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly confgService: ConfigService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() input: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const   authResult = await this.authService.authenticate(input);
        
        res.cookie('refresh_token', authResult.refreshToken, {
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

    @Post('signup')
    signUp(@Body() input: signUpDto) {
        return this.authService.signup(input);
    }

}
