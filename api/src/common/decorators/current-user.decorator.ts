import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserPayload } from '../types/users.types';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) : CurrentUserPayload => {
    const   request = ctx.switchToHttp().getRequest();
    return request.user;
});