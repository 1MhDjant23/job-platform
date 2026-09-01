import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from    'passport-jwt';
import  { Injectable }  from    '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Role } from "@prisma/client";

@Injectable()
export class    JwtAccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
    constructor(private confgService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: confgService.getOrThrow<string>('ACCESS_SECRET'),
            ignoreExpiration: false
        });
    }
    async validate(payload: { sub: string, type: string, role: Role }) {
        console.log("=======================================::::");
        return {
            userId: payload.sub, 
            type: payload.type,
            role: payload.role
        };
    }
} 