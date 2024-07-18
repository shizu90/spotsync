import { Provider } from '@nestjs/common';
import { CreateUserUseCaseProvider } from './application/ports/in/use-cases/create-user.use-case';
import { CreateUserService } from './application/services/create-user.service';
import { UpdateUserCredentialsUseCaseProvider } from './application/ports/in/use-cases/update-user-credentials.use-case';
import { UpdateUserCredentialsService } from './application/services/update-user-credentials.service';
import { DeleteUserUseCaseProvider } from './application/ports/in/use-cases/delete-user.use-case';
import { DeleteUserService } from './application/services/delete-user.service';
import { CreateUserAddressUseCaseProvider } from './application/ports/in/use-cases/create-user-address.use-case';
import { CreateUserAddressService } from './application/services/create-user-address.service';
import { UpdateUserAddressUseCaseProvider } from './application/ports/in/use-cases/update-user-address.use-case';
import { UpdateUserAddressService } from './application/services/update-user-address.service';
import { DeleteUserAddressUseCaseProvider } from './application/ports/in/use-cases/delete-user-address.use-case';
import { DeleteUserAddressService } from './application/services/delete-user-address.service';
import { GetUserAddressUseCaseProvider } from './application/ports/in/use-cases/get-user-address.use-case';
import { GetUserAddressService } from './application/services/get-user-address.service';
import { ListUserAddressesUseCaseProvider } from './application/ports/in/use-cases/list-user-addresses.use-case';
import { ListUserAddressesService } from './application/services/list-user-addresses.service';
import { UpdateUserProfileUseCaseProvider } from './application/ports/in/use-cases/update-user-profile.use-case';
import { UpdateUserProfileService } from './application/services/update-user-profile.service';
import { UploadProfilePictureUseCaseProvider } from './application/ports/in/use-cases/upload-profile-picture.use-case';
import { UploadProfilePictureService } from './application/services/upload-profile-picture.service';
import { UploadBannerPictureUseCaseProvider } from './application/ports/in/use-cases/upload-banner-picture.use-case';
import { UploadBannerPictureService } from './application/services/upload-banner-picture.service';
import { UserRepositoryProvider } from './application/ports/out/user.repository';
import { UserRepositoryImpl } from './infrastructure/adapters/out/user.db';
import { UserAddressRepositoryProvider } from './application/ports/out/user-address.repository';
import { UserAddressRepositoryImpl } from './infrastructure/adapters/out/user-address.db';
import { EncryptPasswordServiceProvider } from './application/ports/out/encrypt-password.service';
import { EncryptPasswordServiceImpl } from './infrastructure/adapters/out/encrypt-password';
import { GetUserProfileUseCaseProvider } from './application/ports/in/use-cases/get-user-profile.use-case';
import { GetUserProfileService } from './application/services/get-user-profile.service';
import { UpdateUserVisibilityConfigUseCaseProvider } from './application/ports/in/use-cases/update-user-visibility-config.use-case';
import { UpdateUserVisibilityConfigService } from './application/services/update-user-visibility-config.service';
import { ListUsersUseCaseProvider } from './application/ports/in/use-cases/list-users.use-case';
import { ListUsersService } from './application/services/list-users.service';

export const Providers: Provider[] = [
	{
		provide: CreateUserUseCaseProvider,
		useClass: CreateUserService,
	},
	{
		provide: UpdateUserCredentialsUseCaseProvider,
		useClass: UpdateUserCredentialsService,
	},
	{
		provide: UpdateUserVisibilityConfigUseCaseProvider,
		useClass: UpdateUserVisibilityConfigService,
	},
	{
		provide: UpdateUserProfileUseCaseProvider,
		useClass: UpdateUserProfileService,
	},
	{
		provide: DeleteUserUseCaseProvider,
		useClass: DeleteUserService,
	},
	{
		provide: UploadProfilePictureUseCaseProvider,
		useClass: UploadProfilePictureService,
	},
	{
		provide: UploadBannerPictureUseCaseProvider,
		useClass: UploadBannerPictureService,
	},
	{
		provide: GetUserProfileUseCaseProvider,
		useClass: GetUserProfileService,
	},
	{
		provide: ListUsersUseCaseProvider,
		useClass: ListUsersService,
	},
	{
		provide: CreateUserAddressUseCaseProvider,
		useClass: CreateUserAddressService,
	},
	{
		provide: UpdateUserAddressUseCaseProvider,
		useClass: UpdateUserAddressService,
	},
	{
		provide: DeleteUserAddressUseCaseProvider,
		useClass: DeleteUserAddressService,
	},
	{
		provide: GetUserAddressUseCaseProvider,
		useClass: GetUserAddressService,
	},
	{
		provide: ListUserAddressesUseCaseProvider,
		useClass: ListUserAddressesService,
	},
	{
		provide: UserRepositoryProvider,
		useClass: UserRepositoryImpl,
	},
	{
		provide: UserAddressRepositoryProvider,
		useClass: UserAddressRepositoryImpl,
	},
	{
		provide: EncryptPasswordServiceProvider,
		useClass: EncryptPasswordServiceImpl,
	},
];
