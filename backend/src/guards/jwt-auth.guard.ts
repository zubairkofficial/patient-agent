import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../utils/jwtpayload.inteface'; // Optional: define interface for token structure
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const token =
      request.headers['authorization']?.toString().split(' ')[1] || '';

    if (!token) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Authorization token is missing',
        error: 'Unauthorized',
      });
    }

    try {
      console.log('token', token, process.env.JWT_SECRET);
      const decoded: any = jwt.verify(
        token,
        `${process.env.JWT_SECRET}`,
        (err, user: any) => {
          if (err) {
            return {
              id: null,
              email: '',
              role: '',
            };
          }
          console.log('user in token', user);
          return user;
        },
      );
      console.log('decoded', decoded);
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException({
          statusCode: 4002,
          message: 'Invalid token payload',
          error: 'Unauthorized',
        });
      }

      // ✅ Attach user info (including role) to request
      request.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      };

      this.logger.debug(
        `User authenticated: ${decoded.email} (${decoded.role})`,
      );
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          statusCode: 4001,
          message: 'Authorization token is expired',
          error: 'Unauthorized',
        });
      }

      throw new UnauthorizedException({
        statusCode: 4002,
        message: 'Invalid or malformed token',
        error: 'Unauthorized',
      });
    }
  }
}
