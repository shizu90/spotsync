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
import { UserAddressDto } from '../ports/out/dto/user-address.dto';
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
	): Promise<UserAddressDto> {
		const user: User = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError();
		}

		const coordinates: GeoLocatorOutput =
			await this.geoLocatorService.coordinates(
				new GeoLocatorInput(
					command.area,
					command.subArea,
					command.countryCode,
					command.locality,
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

		return UserAddressDto.fromModel(userAddress);
	}
}
