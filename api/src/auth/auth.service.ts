import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpUser, UsersService } from 'src/users/users.service';
import  bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

type AuthInput = {email: string, password: string};
type AuthResult = {accessToken: string, refreshToken: string, user: User};
type Validated = {userId: string, email: string };
type User = { userId: string, email: string };

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
        const   user = await this.validateUser(input);
        if(!user) {
            throw new UnauthorizedException();
        }
        const   accessToken = this.jwtService.sign(user, {
            secret: this.confgService.getOrThrow<string>('ACCESS_SECRET'),
            expiresIn: Number(this.confgService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'))
        });
        const   refreshToken = this.jwtService.sign(user, {
            expiresIn: Number(this.confgService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN')),
            secret: this.confgService.getOrThrow<string>('REFRESH_SECRET')
        })
        // Stoore the hashed refresh-token in DB 
        await this.storeRefreshToken({ refreshToken: refreshToken, userId: user.userId });
        return {
            user: { userId: user.userId, email: user.email },
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
/*******    *********** ******** */
    async validateUser(input: AuthInput) : Promise<Validated | null> {
        const   userMatch = await this.userService.findUserByEmail(input.email);
        if(!userMatch) {
            return null;
        }

        const   passwordMatch = await bcrypt.compare(input.password, userMatch.passwordHash)
        if(!passwordMatch) {
            return null;
        }
        return {
            userId: userMatch.id,
            email: userMatch.email
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
        console.log("----------> USER CREATED -------------");
    }

}
