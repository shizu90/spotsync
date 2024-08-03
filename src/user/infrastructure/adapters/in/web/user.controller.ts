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
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { Pagination } from 'src/common/common.repository';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	CreateUserUseCase,
	CreateUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/create-user.use-case';
import {
	DeleteUserUseCase,
	DeleteUserUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/delete-user.use-case';
import {
	GetUserProfileUseCase,
	GetUserProfileUseCaseProvider,
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
	UpdateUserVisibilityConfigUseCase,
	UpdateUserVisibilityConfigUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/update-user-visibility-config.use-case';
import {
	UploadBannerPictureUseCase,
	UploadBannerPictureUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/upload-banner-picture.use-case';
import {
	UploadProfilePictureUseCase,
	UploadProfilePictureUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/upload-profile-picture.use-case';
import { CreateUserDto } from 'src/user/application/ports/out/dto/create-user.dto';
import { GetUserProfileDto } from 'src/user/application/ports/out/dto/get-user-profile.dto';
import { UserErrorHandler } from './handlers/user-error.handler';
import { UserRequestMapper } from './mappers/user-request.mapper';
import { CreateUserRequest } from './requests/create-user.request';
import { ListUsersQueryRequest } from './requests/list-users-query.request';
import { UpdateUserCredentialsRequest } from './requests/update-user-credentials.request';
import { UpdateUserProfileRequest } from './requests/update-user-profile.request';
import { UpdateUserVisibilityConfigRequest } from './requests/update-user-visibility-config.request';

@ApiTags('Users')
@ApiInternalServerErrorResponse({
	example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
})
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserController extends ApiController {
	constructor(
		@Inject(GetUserProfileUseCaseProvider)
		protected readonly getUserProfileUseCase: GetUserProfileUseCase,
		@Inject(ListUsersUseCaseProvider)
		protected readonly listUsersUseCase: ListUsersUseCase,
		@Inject(CreateUserUseCaseProvider)
		protected readonly createUserUseCase: CreateUserUseCase,
		@Inject(UpdateUserProfileUseCaseProvider)
		protected readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
		@Inject(UpdateUserCredentialsUseCaseProvider)
		protected readonly updateUserCredentialsUseCase: UpdateUserCredentialsUseCase,
		@Inject(UpdateUserVisibilityConfigUseCaseProvider)
		protected readonly updateUserVisibilityConfigUseCase: UpdateUserVisibilityConfigUseCase,
		@Inject(UploadProfilePictureUseCaseProvider)
		protected readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
		@Inject(UploadBannerPictureUseCaseProvider)
		protected readonly uploadBannerPictureUseCase: UploadBannerPictureUseCase,
		@Inject(DeleteUserUseCaseProvider)
		protected readonly deleteUserUseCase: DeleteUserUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List users' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetUserProfileDto(
						'uuid',
						'string',
						'string',
						'#000000',
						'string',
						new Date(),
						new Date(),
						'string',
						'string',
						{
							name: 'string',
						},
						{
							profile: 'public',
							addresses: 'public',
							favorite_spot_events: 'public',
							favorite_spot_folders: 'public',
							favorite_spots: 'public',
							posts: 'public',
							spot_folders: 'public',
							visited_spots: 'public',
						},
						0,
						0,
						{
							id: 'uuid',
							name: 'string',
							area: 'string',
							sub_area: 'string',
							locality: 'string',
							latitude: 0,
							longitude: 0,
							country_code: 'BR',
							created_at: new Date(),
							updated_at: new Date(),
						},
						false,
					),
				],
				1,
				0,
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
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
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({
		example: {
			data: new GetUserProfileDto(
				'uuid',
				'string',
				'string',
				'#000000',
				'string',
				new Date(),
				new Date(),
				'string',
				'string',
				{
					name: 'string',
				},
				{
					profile: 'public',
					addresses: 'public',
					favorite_spot_events: 'public',
					favorite_spot_folders: 'public',
					favorite_spots: 'public',
					posts: 'public',
					spot_folders: 'public',
					visited_spots: 'public',
				},
				0,
				0,
				{
					id: 'uuid',
					name: 'string',
					area: 'string',
					sub_area: 'string',
					locality: 'string',
					latitude: 0,
					longitude: 0,
					country_code: 'BR',
					created_at: new Date(),
					updated_at: new Date(),
				},
				false,
			),
		},
	})
	@UseGuards(AuthGuard)
	@Get(':id/profile')
	public async get(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.getUserProfileCommand(id, undefined);

		const data = await this.getUserProfileUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create user' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiConflictResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({
		example: {
			data: new CreateUserDto(
				'uuid',
				'string',
				'string',
				'#000000',
				'string',
				'string',
				'string',
				new Date(),
				false,
				new Date(),
				new Date(),
				{
					profile: 'public',
					addresses: 'public',
					posts: 'public',
					visited_spots: 'public',
					spot_folders: 'public',
					favorite_spots: 'public',
					favorite_spot_folders: 'public',
					favorite_spot_events: 'public',
				},
				{
					name: '',
					email: '',
					phone_number: '',
				},
			),
		},
	})
	@UsePipes(new ValidationPipe({ transform: true }))
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
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Put(':id')
	public async updateProfile(
		@Param('id') id: string,
		@Body() body: UpdateUserProfileRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserProfileCommand(id, body);

		this.updateUserProfileUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Update user credentials' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiConflictResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
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

		this.updateUserCredentialsUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Update user visibility configurations' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Put(':id/visibility-configuration')
	public async udpateVisibilityConfiguration(
		@Param('id') id: string,
		@Body() body: UpdateUserVisibilityConfigRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.updateUserVisibilityConfigCommand(
			id,
			body,
		);

		this.updateUserVisibilityConfigUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Delete user by id' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiForbiddenResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.deleteUserCommand(id);

		this.deleteUserUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
