import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { User } from 'src/user/domain/user.model';
import { GetAuthenticatedUserUseCase } from '../ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthenticatedError } from './errors/unauthenticated.error';

@Injectable()
export class GetAuthenticatedUserService
	implements GetAuthenticatedUserUseCase
{
	public constructor(
		@Inject(REQUEST)
		protected request: Request,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
	) {}

	public async execute(command?: null): Promise<User> {
		const user = await this.userRepository.findById(
			this.request['authenticated_user'],
		);

		if (user === null || user === undefined || user.isDeleted() || user.isInactive()) {
			throw new UnauthenticatedError();
		}

		return user;
	}
}
