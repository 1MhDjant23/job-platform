import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpUser, UsersService } from 'src/users/users.service';
import  bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import type { User as PrismaUser, Role } from '@prisma/client';
import type { User as PublicUser } from '@job-platform/contracts';
import { RefreshPayload } from './auth.controller';
import { toPublicUser } from 'src/users/mappers/user.mapper';

type AuthInput = {email: string, password: string};
type AuthResult = {accessToken: string, refreshToken: string, user: PublicUser};
// export type ValidatedUser = Omit<User, 'passwordHash'|'updatedAt'> ; // validated user without password

type GenerateTokensResult = { accessToken: string, refreshToken: string };


@Injectable()
export class AuthService {
    constructor(
        private readonly confgService: ConfigService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService

    ) {}
/*******    *********** ******** */
/*******    *********** ******** */
/**         LOGIN PART           */
/*******    *********** ******** */

    async authenticate(input: AuthInput) : Promise<AuthResult> {
        const user = await this.validateUser(input);
        if(!user) {
            throw new UnauthorizedException('Unauthorization: email or password dosen\'t match.');
        }
        const   { accessToken, refreshToken } = await this.generateTokens(user.id, user.role);
        // Stoore the hashed refresh-token in DB 
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: user.id });
        return {
            user: toPublicUser(user),
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
/*******    *********** ******** */
    async   generateTokens(sub: string, role: Role) : Promise<GenerateTokensResult> {
        const   accesToken = this.jwtService.sign({ sub: sub, type: 'access', role: role }, {
            secret: this.confgService.getOrThrow<string>('ACCESS_SECRET'),
            expiresIn: Number(this.confgService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'))
        });

        const   refreshToken = this.jwtService.sign({ sub: sub, type: 'refresh', role: role }, {
            expiresIn: Number(this.confgService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN')),
            secret: this.confgService.getOrThrow<string>('REFRESH_SECRET')
        });
        return {
            accessToken: accesToken,
            refreshToken: refreshToken
        }
    }
/*******    *********** ******** */
    async validateUser(input: AuthInput): Promise<PrismaUser | null> {
        const   userMatch = await this.userService.findUserByEmail(input.email);
        if(!userMatch) {
            return null;
        }

        const   passwordMatch = await bcrypt.compare(input.password, userMatch.passwordHash)
        if(!passwordMatch) {
            return null;
        }
        return userMatch;
    }
/*******    *********** ******** */
    async storeRefreshToken(data: {refreshToken: string, userId: string }) {
        const   hashRefreshToken = await bcrypt.hash(data.refreshToken, 10);
        await this.prisma.refreshToken.create({
            data: {
                userId: data.userId,
                hashedRefresh: hashRefreshToken,
                expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
    }
/*******    *********** ******** */
/*******    *********** ******** */
/**         SIGNUP PART          */
/*******    *********** ******** */
    async signup(input: SignUpUser) {
        const   emailInUse = await this.userService.findUserByEmail(input.email);
        if(emailInUse) {
            throw new BadRequestException('Email already in use');
        }
        const   hashPassword = await bcrypt.hash(input.password, 10);

        const   user = await this.userService.create({...input, password: hashPassword});
        const   {accessToken, refreshToken} = await this.generateTokens(input.email, input.role);
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: user.id });

        return { accessToken, refreshToken, user: toPublicUser(user) };
    }
/*******    *********** ******** */
/*******    *********** ******** */
/**         REFRESH PART         */
/*******    *********** ******** */
    async refresh(refreshPayload: RefreshPayload): Promise<{accessToken: string, refreshToken: string, user: PublicUser}> {
        const {user} = await this.prisma.refreshToken.update({
            where: { id: refreshPayload.refreshTokenId },
            data: { revoked: true,  },
            select: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        resumeUrl: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        const   { accessToken, refreshToken } = await this.generateTokens(refreshPayload.userId, refreshPayload.role);
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: refreshPayload.userId });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: toPublicUser(user)
        }
    }

    async handleLogout({userId, refreshTokenId}: {userId: string, refreshTokenId: string}) {
        return await this.prisma.refreshToken.update({
            where: {
                userId: userId,
                id: refreshTokenId
            },
            data: {
                revoked: true
            }
        })

    }
}
