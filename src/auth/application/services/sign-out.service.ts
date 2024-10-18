import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RedisService } from 'src/cache/redis.service';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { SignOutCommand } from '../ports/in/commands/sign-out.command';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from '../ports/in/use-cases/get-authenticated-user.use-case';
import { SignOutUseCase } from '../ports/in/use-cases/sign-out.use-case';

@Injectable()
export class SignOutService implements SignOutUseCase {
	public constructor(
		@Inject(REQUEST)
		protected request: Request,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {}

	public async execute(command: SignOutCommand): Promise<void> {
		const authenticatedUser =
			await this.getAuthenticatedUserUseCase.execute(null);

		const [type, token] = this.request.headers.authorization?.split(' ') ?? [];

		await this.redisService.del(token);

		authenticatedUser.credentials().logout();

		this.userRepository.updateCredentials(authenticatedUser.credentials());
	}
}
