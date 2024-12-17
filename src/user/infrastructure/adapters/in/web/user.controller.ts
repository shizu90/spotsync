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
	UploadedFiles,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { Response } from 'express';
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
import { GetUserBannerPictureUseCase, GetUserBannerPictureUseCaseProvider } from 'src/user/application/ports/in/use-cases/get-user-banner-picture.use-case';
import { GetUserProfilePictureUseCase, GetUserProfilePictureUseCaseProvider } from 'src/user/application/ports/in/use-cases/get-user-profile-picture.use-case';
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
		@Inject(GetUserProfilePictureUseCaseProvider)
		protected readonly getUserProfilePictureUseCase: GetUserProfilePictureUseCase,
		@Inject(GetUserBannerPictureUseCaseProvider)
		protected readonly getUserBannerPictureUseCase: GetUserBannerPictureUseCase,
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
	@ApiOkResponse({ isArray: true, type: UserDto })
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
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'profile_picture', maxCount: 1 },
				{ name: 'banner_picture', maxCount: 1 },
			]
		)
	)
	@Put(':id/profile')
	public async updateProfile(
		@Param('id') id: string,
		@Body() body: UpdateUserProfileRequest,
		@UploadedFiles() files: { profile_picture?: Express.Multer.File[], banner_picture?: Express.Multer.File[] },
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserProfileCommand(id, body, files.profile_picture?.[0], files.banner_picture?.[0]);

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

	@ApiOperation({ summary: 'Get user profile picture' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse()
	@Get(':id/profile-picture')
	public async getProfilePicture(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.getUserProfilePictureCommand(id);

		const file = await this.getUserProfilePictureUseCase.execute(command);

		file.pipe(res);
	}

	@ApiOperation({ summary: 'Get user banner picture' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse()
	@Get(':id/banner-picture')
	public async getBannerPicture(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.getUserBannerPictureCommand(id);

		const file = await this.getUserBannerPictureUseCase.execute(command);

		file.pipe(res);
	}
}
