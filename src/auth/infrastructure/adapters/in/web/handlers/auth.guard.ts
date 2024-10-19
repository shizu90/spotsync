import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { UnauthenticatedError } from 'src/auth/application/services/errors/unauthenticated.error';
import { TokenService } from './token.service';

export class AuthGuard implements CanActivate {
	public constructor(
		@Inject(TokenService)
		protected tokenService: TokenService,
	) {}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthenticatedError();
		}

		try {
			const payload = await this.tokenService.verifyToken<{sub: string, name: string}>(token);

			request['authenticated_user'] = payload.sub;
		} catch {
			throw new UnauthenticatedError();
		}

		return true;
	}
}
