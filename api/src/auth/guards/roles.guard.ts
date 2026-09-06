import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ROLES_KEY } from "src/common/decorators/roles.decorator";

@Injectable()
export  class   RolesGuard implements  CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // console.log("-------- before getAllAndOverride Roles -----------");
        const   requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        // console.log("-------- After required Roles -----------");
        if(!requiredRoles || requiredRoles.length === 0) {
            return false;
        }
        const   {user} = context.switchToHttp().getRequest();
        if(!user) {
            return false;
        }
        return requiredRoles.includes(user?.role);
    }
}