import { ActivateUserCommand } from 'src/user/application/ports/in/commands/activate-user.command';
import { ChangePasswordCommand } from 'src/user/application/ports/in/commands/change-password.command';
import { CreateUserCommand } from 'src/user/application/ports/in/commands/create-user.command';
import { DeleteUserCommand } from 'src/user/application/ports/in/commands/delete-user.command';
import { ForgotPasswordCommand } from 'src/user/application/ports/in/commands/forgot-password.command';
import { GetUserProfileCommand } from 'src/user/application/ports/in/commands/get-user-profile.command';
import { ListUsersCommand } from 'src/user/application/ports/in/commands/list-users.command';
import { UpdateUserCredentialsCommand } from 'src/user/application/ports/in/commands/update-user-credentials.command';
import { UpdateUserProfileCommand } from 'src/user/application/ports/in/commands/update-user-profile.command';
import { UpdateUserVisibilityConfigCommand } from 'src/user/application/ports/in/commands/update-user-visibility-config.command';
import { ActivateUserRequest } from '../requests/activate-user.request';
import { ChangePasswordRequest } from '../requests/change-password.request';
import { CreateUserRequest } from '../requests/create-user.request';
import { ForgotPasswordRequest } from '../requests/forgot-password.request';
import { ListUsersQueryRequest } from '../requests/list-users-query.request';
import { UpdateUserCredentialsRequest } from '../requests/update-user-credentials.request';
import { UpdateUserProfileRequest } from '../requests/update-user-profile.request';
import { UpdateUserVisibilityConfigRequest } from '../requests/update-user-visibility-config.request';

export class UserRequestMapper {
	public static getUserProfileCommand(
		id: string,
		name: string,
	): GetUserProfileCommand {
		return new GetUserProfileCommand(id, name);
	}

	public static listUsersCommand(
		query: ListUsersQueryRequest,
	): ListUsersCommand {
		return new ListUsersCommand(
			query.first_name,
			query.last_name,
			query.full_name,
			query.name,
			query.sort,
			query.sort_direction,
			Number.isNaN(Number(query.page)) ? 0 : Number(query.page),
			Boolean(query.paginate),
			Number.isNaN(Number(query.limit)) ? 12 : Number(query.limit),
		);
	}

	public static createUserCommand(
		request: CreateUserRequest,
	): CreateUserCommand {
		return new CreateUserCommand(
			request.name,
			request.email,
			request.password,
			request.phone_number,
			request.address ? {
				area: request.address.area,
				subArea: request.address.sub_area,
				countryCode: request.address.country_code,
				locality: request.address.locality,
				latitude: request.address.latitude,
				longitude: request.address.longitude,
			} : null
		);
	}

	public static updateUserProfileCommand(
		id: string,
		request: UpdateUserProfileRequest,
	): UpdateUserProfileCommand {
		return new UpdateUserProfileCommand(
			id,
			request.first_name,
			request.last_name,
			request.profile_theme_color,
			request.biograph,
			request.birth_date,
		);
	}

	public static updateUserCredentialsCommand(
		id: string,
		request: UpdateUserCredentialsRequest,
	): UpdateUserCredentialsCommand {
		return new UpdateUserCredentialsCommand(
			id,
			request.name,
			request.email,
			request.password,
			request.phone_number,
		);
	}

	public static updateUserVisibilityConfigCommand(
		id: string,
		request: UpdateUserVisibilityConfigRequest,
	): UpdateUserVisibilityConfigCommand {
		return new UpdateUserVisibilityConfigCommand(
			id,
			request.profile,
			request.spot_folders,
			request.visited_spots,
			request.addresses,
			request.posts,
			request.favorite_spots,
			request.favorite_spot_folders,
			request.favorite_spot_events,
		);
	}

	public static deleteUserCommand(id: string): DeleteUserCommand {
		return new DeleteUserCommand(id);
	}

	public static forgotPasswordCommand(body: ForgotPasswordRequest): ForgotPasswordCommand {
		return new ForgotPasswordCommand(body.email);
	}

	public static changePasswordCommand(body: ChangePasswordRequest): ChangePasswordCommand {
		return new ChangePasswordCommand(body.password, body.token);
	}

	public static activateUserCommand(id: string, body: ActivateUserRequest): ActivateUserCommand {
		return new ActivateUserCommand(id, body.code, body.auto_login ?? false)
	}
}
