import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/auth.service';

import { Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    // Delegate token verification to check-service via gRPC
    try {
      // Assuming check-service exposes a VerifyToken RPC. Adjust as needed.
      const result = await this.authService.verifyToken({ token });
      if (!result || !result.valid) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = result.user; // attach user info if returned
      return true;
    } catch (err) {
      let errMsg = typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err);
      throw new UnauthorizedException('Token verification failed: ' + errMsg);
    }
  }
}
