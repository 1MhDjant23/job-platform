import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserPayload } from '../types/users.types';
import { RefreshPayload } from 'src/auth/auth.controller';
// import { RefreshRequest } from 'src/auth/auth.controller';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) : CurrentUserPayload | RefreshPayload => {
    const   request = ctx.switchToHttp().getRequest();
    return request.user;
});