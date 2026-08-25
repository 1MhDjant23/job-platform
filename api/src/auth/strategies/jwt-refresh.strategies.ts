import  { Injectable }  from    '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


// @Injectable()
// export  class   JwtRefreshStrategy  extends PassportStrategy(Strategy, 'jwt-refresh') {
//     constructor(
//         private readonly confgService: ConfigService
//     ) {
//         super({
//             secretOrKey: confgService.get<string>('REFRESH_SECRET') ?? "to fix in the next"
//         });
//     }
//     async   validate(paylod: string) {

//     }
// }