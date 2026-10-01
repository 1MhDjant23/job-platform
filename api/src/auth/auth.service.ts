import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpUser, UsersService } from 'src/users/users.service';
import  bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import  { User }    from    '@job-platform/contracts';
import { RefreshPayload } from './auth.controller';

type AuthInput = {email: string, password: string};
type AuthResult = {accessToken: string, refreshToken: string, user: User};
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
        const   user: User = await this.validateUser(input);
        if(!user) {
            throw new UnauthorizedException('Unauthorization: email or password dosen\'t match.');
        }
        const   { accessToken, refreshToken } = await this.generateTokens(user.id, user.role);
        // Stoore the hashed refresh-token in DB 
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: user.id });
        return {
            user:  user,
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
    async validateUser(input: AuthInput) : Promise<User | null> {
        const   userMatch = await this.userService.findUserByEmail(input.email);
        if(!userMatch) {
            return null;
        }

        const   passwordMatch = await bcrypt.compare(input.password, userMatch.passwordHash)
        if(!passwordMatch) {
            return null;
        }
        return {
            id: userMatch.id,
            email: userMatch.email,
            firstName: userMatch.firstName,
            lastName: userMatch.lastName,
            resumUrl: userMatch.resumUrl,
            avatarUrl: userMatch.avatarUrl,
            role: userMatch.role
        }
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
        await this.userService.create({...input, password: hashPassword});
    }
/*******    *********** ******** */
/*******    *********** ******** */
/**         REFRESH PART         */
/*******    *********** ******** */
    async refresh(refreshPayload: RefreshPayload) {
        const user = await this.prisma.refreshToken.update({
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
                        resumUrl: true
                    }
                }
            }
        });

        const   { accessToken, refreshToken } = await this.generateTokens(refreshPayload.userId, refreshPayload.role);
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: refreshPayload.userId });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user
        }
    }
}
