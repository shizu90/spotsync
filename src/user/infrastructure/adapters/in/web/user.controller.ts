import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SignInDto } from 'src/auth/application/ports/out/dto/sign-in.dto';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	ActivateUserUseCase,
	ActivateUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/activate-user.use-case';
import {
	CreateUserUseCase,
	CreateUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/create-user.use-case';
import {
	DeleteUserUseCase,
	DeleteUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/delete-user.use-case';
import {
	GetUserUseCase,
	GetUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/get-user-profile.use-case';
import {
	ListUsersUseCase,
	ListUsersUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/list-users.use-case';
import {
	UpdateUserCredentialsUseCase,
	UpdateUserCredentialsUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/update-user-credentials.use-case';
import {
	UpdateUserProfileUseCase,
	UpdateUserProfileUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/update-user-profile.use-case';
import {
	UpdateUserVisibilitySettingsUseCase,
	UpdateUserVisibilitySettingsUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/update-user-visibility-settings.use-case';
import {
	UploadBannerPictureUseCase,
	UploadBannerPictureUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/upload-banner-picture.use-case';
import {
	UploadProfilePictureUseCase,
	UploadProfilePictureUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/upload-profile-picture.use-case';
import { UserDto } from 'src/user/application/ports/out/dto/user.dto';
import { UserErrorHandler } from './handlers/user-error.handler';
import { UserRequestMapper } from './mappers/user-request.mapper';
import { ActivateUserRequest } from './requests/activate-user.request';
import { CreateUserRequest } from './requests/create-user.request';
import { ListUsersQueryRequest } from './requests/list-users-query.request';
import { UpdateUserCredentialsRequest } from './requests/update-user-credentials.request';
import { UpdateUserProfileRequest } from './requests/update-user-profile.request';
import { UpdateUserVisibilitySettingsRequest } from './requests/update-user-visibility-settings.request';

@ApiTags('Users')
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserController extends ApiController {
	constructor(
		@Inject(GetUserUseCaseProvider)
		protected readonly getUserUseCase: GetUserUseCase,
		@Inject(ListUsersUseCaseProvider)
		protected readonly listUsersUseCase: ListUsersUseCase,
		@Inject(CreateUserUseCaseProvider)
		protected readonly createUserUseCase: CreateUserUseCase,
		@Inject(UpdateUserProfileUseCaseProvider)
		protected readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
		@Inject(UpdateUserCredentialsUseCaseProvider)
		protected readonly updateUserCredentialsUseCase: UpdateUserCredentialsUseCase,
		@Inject(UpdateUserVisibilitySettingsUseCaseProvider)
		protected readonly updateUserVisibilitySettingsUseCase: UpdateUserVisibilitySettingsUseCase,
		@Inject(UploadProfilePictureUseCaseProvider)
		protected readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
		@Inject(UploadBannerPictureUseCaseProvider)
		protected readonly uploadBannerPictureUseCase: UploadBannerPictureUseCase,
		@Inject(DeleteUserUseCaseProvider)
		protected readonly deleteUserUseCase: DeleteUserUseCase,
		@Inject(ActivateUserUseCaseProvider)
		protected readonly activateUserUseCase: ActivateUserUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List users' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: Array<UserDto> })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Get()
	public async list(
		@Query() query: ListUsersQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.listUsersCommand(query);

		const data = await this.listUsersUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get user by id' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: UserDto })
	@UseGuards(AuthGuard)
	@Get(':id')
	public async get(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.getUserCommand(id, undefined);

		const data = await this.getUserUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create user' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiConflictResponse({ type: ErrorResponse})
	@ApiCreatedResponse({ type: UserDto })
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post()
	public async create(
		@Body() body: CreateUserRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.createUserCommand(body);

		const data = await this.createUserUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update user profile' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/profile')
	public async updateProfile(
		@Param('id') id: string,
		@Body() body: UpdateUserProfileRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserProfileCommand(id, body);

		await this.updateUserProfileUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Update user credentials' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/credentials')
	public async updateCredentials(
		@Param('id') id: string,
		@Body() body: UpdateUserCredentialsRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserCredentialsCommand(
			id,
			body,
		);

		await this.updateUserCredentialsUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Update user visibility settings' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/visibility-settings')
	public async updateUserVisibilitySettings(
		@Param('id') id: string,
		@Body() body: UpdateUserVisibilitySettingsRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserVisibilitySettingsCommand(
			id,
			body,
		);

		await this.updateUserVisibilitySettingsUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete user by id' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@ApiForbiddenResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.deleteUserCommand(id);

		await this.deleteUserUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Activate user' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: SignInDto })
	@ApiNoContentResponse()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post(':id/activate')
	public async activate(
		@Param('id') id: string,
		@Body() body: ActivateUserRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.activateUserCommand(id, body);

		const data = await this.activateUserUseCase.execute(command);

		res.status(data != null && data != undefined ? HttpStatus.OK : HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}
}
