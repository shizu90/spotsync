import { Inject, Injectable } from '@nestjs/common';
import { GetAuthenticatedUserUseCase } from '../ports/in/use-cases/get-authenticated-user.use-case';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class GetAuthenticatedUserService
	implements GetAuthenticatedUserUseCase
{
	public constructor(
		@Inject(REQUEST)
		protected request: Request,
	) {}

	public execute(command?: null): string {
		return this.request['authenticated_user'];
	}
}
