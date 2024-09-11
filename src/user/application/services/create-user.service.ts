import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GeoLocatorInput, GeoLocatorProvider } from 'src/geolocation/geolocator';
import { GeoLocatorService } from 'src/geolocation/geolocator.service';
import { Mail, MailProvider } from 'src/mail/mail';
import { NewUserMailTemplate } from 'src/mail/templates/new-user-mail.template';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';
import { CreateUserCommand } from '../ports/in/commands/create-user.command';
import { CreateUserUseCase } from '../ports/in/use-cases/create-user.use-case';
import { CreateUserDto } from '../ports/out/dto/create-user.dto';
import {
	EncryptPasswordService,
	EncryptPasswordServiceProvider,
} from '../ports/out/encrypt-password.service';
import { UserAddressRepository, UserAddressRepositoryProvider } from '../ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../ports/out/user.repository';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

@Injectable()
export class CreateUserService implements CreateUserUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GeoLocatorProvider)
		protected geoLocatorService: GeoLocatorService,
		@Inject(EncryptPasswordServiceProvider)
		protected encryptPasswordService: EncryptPasswordService,
		@Inject(MailProvider)
		protected mail: Mail
	) {}

	public async execute(command: CreateUserCommand): Promise<CreateUserDto> {
		if ((await this.userRepository.findByEmail(command.email)) !== null) {
			throw new UserAlreadyExistsError(
				`E-mail ${command.email} already in use`,
			);
		}

		if ((await this.userRepository.findByName(command.name)) !== null) {
			throw new UserAlreadyExistsError(
				`User name ${command.name} already taken`,
			);
		}

		const userId = randomUUID();

		const user: User = User.create(
			userId,
			command.name,
			null,
			null,
			null,
			null,
			null,
			null,
		);

		user.createCredentials(
			command.name,
			command.email,
			await this.encryptPasswordService.encrypt(command.password),
			command.phoneNumber ?? null,
		);

		user.createVisibilityConfig(
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
		);

		await this.userRepository.store(user);

		if (command.address !== null && command.address !== undefined) {
			let latitude = command.address.latitude;
			let longitude = command.address.longitude;

			if ((latitude === null || latitude === undefined) || (longitude === null || longitude === undefined)) {
				const coordinates = await this.geoLocatorService.coordinates(new GeoLocatorInput(
					command.address.area,
					command.address.subArea,
					command.address.locality,
					command.address.countryCode,
				));

				latitude = coordinates.latitude;
				longitude = coordinates.longitude;
			} 
			
			const address = UserAddress.create(
				randomUUID(),
				'Main',
				command.address.area,
				command.address.subArea,
				command.address.locality,
				latitude,
				longitude,
				command.address.countryCode,
				true,
				user,
			);

			this.userAddressRepository.store(address);
		}

		this.mail.setReceiver(user.credentials().email()).setTemplate(new NewUserMailTemplate({
			userName: user.credentials().name(),
		})).send();

		return new CreateUserDto(
			user.id(),
			user.firstName(),
			user.lastName(),
			user.profileThemeColor(),
			user.biograph(),
			user.profilePicture(),
			user.bannerPicture(),
			user.birthDate(),
			user.isDeleted(),
			user.createdAt(),
			user.updatedAt(),
			{
				profile: user.visibilityConfiguration().profile(),
				addresses: user.visibilityConfiguration().addresses(),
				spot_folders: user.visibilityConfiguration().spotFolders(),
				visited_spots: user.visibilityConfiguration().visitedSpots(),
				posts: user.visibilityConfiguration().posts(),
				favorite_spots: user.visibilityConfiguration().favoriteSpots(),
				favorite_spot_folders: user
					.visibilityConfiguration()
					.favoriteSpotFolders(),
				favorite_spot_events: user
					.visibilityConfiguration()
					.favoriteSpotEvents(),
			},
			{
				name: user.credentials().name(),
				email: user.credentials().email(),
				phone_number: user.credentials().phoneNumber(),
			},
		);
	}
}
