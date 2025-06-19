import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Replace this with your real logic
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Access denied');
    }

    return true;
  }
}
