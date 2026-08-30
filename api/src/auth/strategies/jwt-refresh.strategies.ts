import  { Injectable, UnauthorizedException }  from    '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import bcrypt   from    'bcrypt';
import { Role } from '@prisma/client';


@Injectable()
export  class   JwtRefreshStrategy  extends PassportStrategy(Strategy, 'refreshToken') {
    constructor(
        private readonly confgService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    console.log("Extract from HTTP-ONLY: ", req?.cookies?.refreshToken);
                    return req?.cookies?.refreshToken;
                },
            ]),
            secretOrKey: confgService.getOrThrow<string>('REFRESH_SECRET'),
            passReqToCallback: true,
            ignoreExpiration: true
        });
    }
    async   validate(req: Request, paylod: { sub: string, type: string, role: Role }) {
        const   refreshToken = req.cookies.refreshToken;
        const   user = await this.usersService.findUserById(paylod.sub);
        if(!user || user.refreshTokens.length === 0) {
            throw new UnauthorizedException('Unauthorization: user or user.refreshToken dosen\'t match');
        }
        let   matchedToken = null;
        for(const token of user.refreshTokens) {
            const   isMatch = await bcrypt.compare(refreshToken, token.hashedRefresh);
            if(isMatch) {
                matchedToken = token;
                break ;
            }
        }
        if(!matchedToken || matchedToken.revoked) {
            throw new UnauthorizedException('Unauthorization: refresh token not match or revoked');
        }
        return {
            userId: user.id,
            refreshTokenId: matchedToken.id,
            role: paylod.role
        };
    }
}