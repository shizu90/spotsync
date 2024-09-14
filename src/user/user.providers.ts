import { Provider } from '@nestjs/common';
import { ActivateUserUseCaseProvider } from './application/ports/in/use-cases/activate-user.use-case';
import { ChangePasswordUseCaseProvider } from './application/ports/in/use-cases/change-password.use-case';
import { CreateUserAddressUseCaseProvider } from './application/ports/in/use-cases/create-user-address.use-case';
import { CreateUserUseCaseProvider } from './application/ports/in/use-cases/create-user.use-case';
import { DeleteUserAddressUseCaseProvider } from './application/ports/in/use-cases/delete-user-address.use-case';
import { DeleteUserUseCaseProvider } from './application/ports/in/use-cases/delete-user.use-case';
import { ForgotPasswordUseCaseProvider } from './application/ports/in/use-cases/forgot-password.use-case';
import { GetUserAddressUseCaseProvider } from './application/ports/in/use-cases/get-user-address.use-case';
import { GetUserProfileUseCaseProvider } from './application/ports/in/use-cases/get-user-profile.use-case';
import { ListUserAddressesUseCaseProvider } from './application/ports/in/use-cases/list-user-addresses.use-case';
import { ListUsersUseCaseProvider } from './application/ports/in/use-cases/list-users.use-case';
import { UpdateUserAddressUseCaseProvider } from './application/ports/in/use-cases/update-user-address.use-case';
import { UpdateUserCredentialsUseCaseProvider } from './application/ports/in/use-cases/update-user-credentials.use-case';
import { UpdateUserProfileUseCaseProvider } from './application/ports/in/use-cases/update-user-profile.use-case';
import { UpdateUserVisibilityConfigUseCaseProvider } from './application/ports/in/use-cases/update-user-visibility-config.use-case';
import { UploadBannerPictureUseCaseProvider } from './application/ports/in/use-cases/upload-banner-picture.use-case';
import { UploadProfilePictureUseCaseProvider } from './application/ports/in/use-cases/upload-profile-picture.use-case';
import { ActivationRequestRepositoryProvider } from './application/ports/out/activation-request.repository';
import { EncryptPasswordServiceProvider } from './application/ports/out/encrypt-password.service';
import { PasswordRecoveryRepositoryProvider } from './application/ports/out/password-recovery.repository';
import { UserAddressRepositoryProvider } from './application/ports/out/user-address.repository';
import { UserRepositoryProvider } from './application/ports/out/user.repository';
import { ActivateUserService } from './application/services/activate-user.service';
import { ChangePasswordService } from './application/services/change-password.service';
import { CreateUserAddressService } from './application/services/create-user-address.service';
import { CreateUserService } from './application/services/create-user.service';
import { DeleteUserAddressService } from './application/services/delete-user-address.service';
import { DeleteUserService } from './application/services/delete-user.service';
import { ForgotPasswordService } from './application/services/forgot-password.service';
import { GetUserAddressService } from './application/services/get-user-address.service';
import { GetUserProfileService } from './application/services/get-user-profile.service';
import { ListUserAddressesService } from './application/services/list-user-addresses.service';
import { ListUsersService } from './application/services/list-users.service';
import { UpdateUserAddressService } from './application/services/update-user-address.service';
import { UpdateUserCredentialsService } from './application/services/update-user-credentials.service';
import { UpdateUserProfileService } from './application/services/update-user-profile.service';
import { UpdateUserVisibilityConfigService } from './application/services/update-user-visibility-config.service';
import { UploadBannerPictureService } from './application/services/upload-banner-picture.service';
import { UploadProfilePictureService } from './application/services/upload-profile-picture.service';
import { ActivationRequestRepositoryImpl } from './infrastructure/adapters/out/activation-request.db';
import { EncryptPasswordServiceImpl } from './infrastructure/adapters/out/encrypt-password';
import { PasswordRecoveryRepositoryImpl } from './infrastructure/adapters/out/password-recovery.db';
import { UserAddressRepositoryImpl } from './infrastructure/adapters/out/user-address.db';
import { UserRepositoryImpl } from './infrastructure/adapters/out/user.db';

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
		provide: ForgotPasswordUseCaseProvider,
		useClass: ForgotPasswordService,
	},
	{
		provide: ChangePasswordUseCaseProvider,
		useClass: ChangePasswordService,
	},
	{
		provide: ActivateUserUseCaseProvider,
		useClass: ActivateUserService,
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
		provide: PasswordRecoveryRepositoryProvider,
		useClass: PasswordRecoveryRepositoryImpl,
	},
	{
		provide: EncryptPasswordServiceProvider,
		useClass: EncryptPasswordServiceImpl,
	},
	{
		provide: ActivationRequestRepositoryProvider,
		useClass: ActivationRequestRepositoryImpl,
	}
];
