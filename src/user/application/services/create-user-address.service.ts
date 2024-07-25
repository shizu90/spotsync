import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	GeoLocatorInput,
	GeoLocatorOutput,
	GeoLocatorProvider,
	Geolocator,
} from 'src/geolocation/geolocator';
import { UserAddress } from 'src/user/domain/user-address.model';
import { User } from 'src/user/domain/user.model';
import { CreateUserAddressCommand } from '../ports/in/commands/create-user-address.command';
import { CreateUserAddressUseCase } from '../ports/in/use-cases/create-user-address.use-case';
import { CreateUserAddressDto } from '../ports/out/dto/create-user-address.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';

@Injectable()
export class CreateUserAddressService implements CreateUserAddressUseCase {
	constructor(
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GeoLocatorProvider)
		protected geoLocatorService: Geolocator,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: CreateUserAddressCommand,
	): Promise<CreateUserAddressDto> {
		const user: User = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const coordinates: GeoLocatorOutput =
			await this.geoLocatorService.coordinates(
				new GeoLocatorInput(
					command.area,
					command.subArea,
					command.locality,
					command.countryCode,
				),
			);

		const userAddress: UserAddress = UserAddress.create(
			randomUUID(),
			command.name,
			command.area,
			command.subArea,
			command.locality,
			coordinates.latitude,
			coordinates.longitude,
			command.countryCode,
			command.main,
			user,
		);

		if (userAddress.main()) {
			const mainAddresses: Array<UserAddress> =
				await this.userAddressRepository.findBy({
					userId: user.id(),
					main: true,
				});

			mainAddresses.forEach((userAddress: UserAddress) => {
				userAddress.changeMain(false);
				this.userAddressRepository.update(userAddress);
			});
		}

		this.userAddressRepository.store(userAddress);

		return new CreateUserAddressDto(
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
