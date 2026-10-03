import {
        Controller, 
        Post, 
        Body,
        UseGuards,
        HttpStatus, 
        HttpCode,
        Get,
        Res,
        } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, signUpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshGuard } from './guards/jwt-refresh.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { ApiResponse } from 'src/common/interfaces/globale.response.types';
import { User } from '@job-platform/contracts';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { JwtAccessGuard } from './guards/jwt-access.guards';

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
    ) : Promise<ApiResponse<{user: User, accessToken: string}>> {
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
    async signUp(
        @Body() input: signUpDto,
        @Res({ passthrough: true }) res: Response,

    ) : Promise<ApiResponse<{user: User, accessToken: string}>> {

        const   authResult = await this.authService.signup(input);
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
    @Get('refresh')
    @UseGuards(JwtRefreshGuard)
    async getRefreshToken( 
        @CurrentUser() u: RefreshPayload,
        @Res({ passthrough: true }) res: Response 
    ): Promise<ApiResponse<{accessToken: string, user: User}>> {
        
        const   { accessToken, refreshToken, user } = await this.authService.refresh(u)
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
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
    
    /*******    *********** ******** */
    @Post('logout')
    @Roles(Role.Employer, Role.JobSeeker)
    @UseGuards(JwtRefreshGuard, RolesGuard)
    async logOut(
        @CurrentUser() user: RefreshPayload,
        @Res({ passthrough: true }) res: Response
    ) {

        await this.authService.handleLogout({userId: user.userId, refreshTokenId: user.refreshTokenId})
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.confgService.getOrThrow<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            path: '/'
        });
        return {
            data: null
        }

    }

}
