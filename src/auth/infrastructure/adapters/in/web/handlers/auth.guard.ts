import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from 'process';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';

export class AuthGuard implements CanActivate {
  public constructor(
    @Inject(JwtService)
    protected jwtService: JwtService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedAccessError(`Unauthorized access`);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
      });

      request['authenticated_user'] = payload.sub;
    } catch {
      throw new UnauthorizedAccessError(`Unauthorized access`);
    }

    return true;
  }
}
