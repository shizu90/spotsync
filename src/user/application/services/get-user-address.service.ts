import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UserAddress } from 'src/user/domain/user-address.model';
import { GetUserAddressCommand } from '../ports/in/commands/get-user-address.command';
import { GetUserAddressUseCase } from '../ports/in/use-cases/get-user-address.use-case';
import { GetUserAddressDto } from '../ports/out/dto/get-user-address.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import { UserAddressNotFoundError } from './errors/user-address-not-found.error';

@Injectable()
export class GetUserAddressService implements GetUserAddressUseCase {
	constructor(
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: GetUserAddressCommand,
	): Promise<GetUserAddressDto> {
		const user = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError();
		}

		const userAddress: UserAddress =
			await this.userAddressRepository.findById(command.id);

		if (
			userAddress === null ||
			userAddress === undefined ||
			userAddress.user().id() !== user.id() ||
			userAddress.isDeleted()
		) {
			throw new UserAddressNotFoundError();
		}

		return new GetUserAddressDto(
			userAddress.id(),
			userAddress.name(),
			userAddress.area(),
			userAddress.subArea(),
			userAddress.locality(),
			userAddress.countryCode(),
			userAddress.latitude(),
			userAddress.longitude(),
			userAddress.main(),
			userAddress.createdAt(),
			userAddress.updatedAt(),
		);
	}
}
