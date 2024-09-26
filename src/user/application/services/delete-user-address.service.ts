import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserAddress } from 'src/user/domain/user-address.model';
import { User } from 'src/user/domain/user.model';
import { DeleteUserAddressCommand } from '../ports/in/commands/delete-user-address.command';
import { DeleteUserAddressUseCase } from '../ports/in/use-cases/delete-user-address.use-case';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import { UserAddressNotFoundError } from './errors/user-address-not-found.error';

@Injectable()
export class DeleteUserAddressService implements DeleteUserAddressUseCase {
	constructor(
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: DeleteUserAddressCommand): Promise<void> {
		const user: User = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError();
		}

		const userAddress: UserAddress =
			await this.userAddressRepository.findById(command.id);

		if (
			userAddress === null ||
			userAddress === undefined ||
			userAddress.isDeleted() ||
			userAddress.user().id() !== user.id()
		) {
			throw new UserAddressNotFoundError();
		}

		userAddress.delete();

		this.userAddressRepository.update(userAddress);
	}
}
