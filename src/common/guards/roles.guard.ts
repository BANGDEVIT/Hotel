import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role-decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Không có @Roles() → cho qua
    if (!requiredRoles) return true;

    const { account } = context.switchToHttp().getRequest();

    // ← user.roles là array vì 1 account có thể có nhiều role
    return requiredRoles.some((role) => account.roles?.includes(role));
  }
}
