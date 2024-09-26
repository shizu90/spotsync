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
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { Pagination } from 'src/common/core/common.repository';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	CreateUserAddressUseCase,
	CreateUserAddressUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/create-user-address.use-case';
import {
	DeleteUserAddressUseCase,
	DeleteUserAddressUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/delete-user-address.use-case';
import {
	GetUserAddressUseCase,
	GetUserAddressUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/get-user-address.use-case';
import {
	ListUserAddressesUseCase,
	ListUserAddressesUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/list-user-addresses.use-case';
import {
	UpdateUserAddressUseCase,
	UpdateUserAddressUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/update-user-address.use-case';
import { CreateUserAddressDto } from 'src/user/application/ports/out/dto/create-user-address.dto';
import { GetUserAddressDto } from 'src/user/application/ports/out/dto/get-user-address.dto';
import { UserErrorHandler } from './handlers/user-error.handler';
import { UserAddressRequestMapper } from './mappers/user-address-request.mapper';
import { CreateUserAddressRequest } from './requests/create-user-address.request';
import { ListUserAddressesQueryRequest } from './requests/list-user-addresses-query.request';
import { UpdateUserAddressRequest } from './requests/update-user-address.request';

@ApiTags('User addresses')
@ApiUnauthorizedResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@ApiInternalServerErrorResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@ApiForbiddenResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserAddressController extends ApiController {
	constructor(
		@Inject(GetUserAddressUseCaseProvider)
		protected getUserAddressUseCase: GetUserAddressUseCase,
		@Inject(ListUserAddressesUseCaseProvider)
		protected listUserAddressesUseCase: ListUserAddressesUseCase,
		@Inject(CreateUserAddressUseCaseProvider)
		protected createUserAddressUseCase: CreateUserAddressUseCase,
		@Inject(UpdateUserAddressUseCaseProvider)
		protected updateUserAddressUseCase: UpdateUserAddressUseCase,
		@Inject(DeleteUserAddressUseCaseProvider)
		protected deleteUserAddressUseCase: DeleteUserAddressUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List user addresses' })
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetUserAddressDto(
						'uuid',
						'string',
						'string',
						'string',
						'string',
						'BR',
						0,
						0,
						false,
						new Date(),
						new Date(),
					),
				],
				1,
				0,
				10,
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Get(':id/addresses')
	public async list(
		@Param('id') id: string,
		@Query() query: ListUserAddressesQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserAddressRequestMapper.listUserAddressesCommand(
			id,
			query,
		);

		const data = await this.listUserAddressesUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get user address' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiOkResponse({
		example: {
			data: new GetUserAddressDto(
				'uuid',
				'string',
				'string',
				'string',
				'string',
				'BR',
				0,
				0,
				false,
				new Date(),
				new Date(),
			),
		},
	})
	@UseGuards(AuthGuard)
	@Get(':id/addresses/:address_id')
	public async getAddress(
		@Param('id') id: string,
		@Param('address_id') addressId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserAddressRequestMapper.getUserAddressCommand(
			addressId,
			id,
		);

		const data = await this.getUserAddressUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create user address' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiOkResponse({
		example: {
			data: new CreateUserAddressDto(
				'uuid',
				'string',
				'string',
				'string',
				'string',
				'BR',
				0,
				0,
				false,
				new Date(),
				new Date(),
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Post(':id/addresses')
	public async createAddress(
		@Param('id') id: string,
		@Body() request: CreateUserAddressRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserAddressRequestMapper.createUserAddressCommand(
			id,
			request,
		);

		const data = await this.createUserAddressUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update user address' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Put(':id/addresses/:address_id')
	public async updateAddress(
		@Param('id') id: string,
		@Param('address_id') addressId: string,
		@Body() body: UpdateUserAddressRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserAddressRequestMapper.updateUserAddressCommand(
			addressId,
			id,
			body,
		);

		await this.updateUserAddressUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Delete user address' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id/addresses/:address_id')
	public async deleteAddress(
		@Param('id') id: string,
		@Param('address_id') addressId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserAddressRequestMapper.deleteUserAddressCommand(
			addressId,
			id,
		);

		await this.deleteUserAddressUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
