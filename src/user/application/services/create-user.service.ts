import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GeoLocatorInput,
	GeoLocatorProvider,
} from 'src/geolocation/geolocator';
import { GeoLocatorService } from 'src/geolocation/geolocator.service';
import { Mail, MailProvider } from 'src/mail/mail';
import { NewUserMailTemplate } from 'src/mail/templates/new-user-mail.template';
import { ActivationRequestSubject } from 'src/user/domain/activation-request-subject.enum';
import { ActivationRequest } from 'src/user/domain/activation-request.model';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';
import { CreateUserCommand } from '../ports/in/commands/create-user.command';
import { CreateUserUseCase } from '../ports/in/use-cases/create-user.use-case';
import {
	ActivationRequestRepository,
	ActivationRequestRepositoryProvider,
} from '../ports/out/activation-request.repository';
import { UserDto } from '../ports/out/dto/user.dto';
import {
	EncryptPasswordService,
	EncryptPasswordServiceProvider,
} from '../ports/out/encrypt-password.service';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
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
		@Inject(ActivationRequestRepositoryProvider)
		protected activationRequestRepository: ActivationRequestRepository,
		@Inject(MailProvider)
		protected mail: Mail,
	) {}

	public async execute(command: CreateUserCommand): Promise<UserDto> {
		if ((await this.userRepository.findByEmail(command.email)) !== null) {
			throw new UserAlreadyExistsError('E-mail already in use.');
		}

		if ((await this.userRepository.findByName(command.name)) !== null) {
			throw new UserAlreadyExistsError('User name already taken.');
		}

		const userId = randomUUID();

		const profile = UserProfile.create(
			userId,
			command.birthDate,
			command.name,
		);

		const credentials = UserCredentials.create(
			userId,
			command.name,
			command.email,
			await this.encryptPasswordService.encrypt(command.password),
			command.phoneNumber,
		);

		const visibilitySettings = UserVisibilitySettings.create(
			userId,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
		);

		const user = User.create(
			userId,
			profile,
			credentials,
			visibilitySettings,
		);

		await this.userRepository.store(user);

		if (command.address !== null && command.address !== undefined) {
			let latitude = command.address.latitude;
			let longitude = command.address.longitude;

			if (
				latitude === null ||
				latitude === undefined ||
				longitude === null ||
				longitude === undefined
			) {
				const coordinates = await this.geoLocatorService.coordinates(
					new GeoLocatorInput(
						command.address.area,
						command.address.subArea,
						command.address.countryCode,
						command.address.locality,
					),
				);

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

			await this.userAddressRepository.store(address);
		}

		const activationRequest = ActivationRequest.create(
			randomUUID(),
			user,
			ActivationRequestSubject.NEW_USER,
		);

		await this.activationRequestRepository.store(activationRequest);

		this.mail
			.setReceiver(user.credentials().email())
			.setTemplate(
				new NewUserMailTemplate({
					userName: user.credentials().name(),
					activationCode: activationRequest.code(),
					userId: user.id(),
				}),
			)
			.send();

		return UserDto.fromModel(user).removeSensitiveData();
	}
}
