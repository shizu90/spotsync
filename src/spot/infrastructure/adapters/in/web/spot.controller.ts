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
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { Pagination } from 'src/common/core/common.repository';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	CreateSpotUseCase,
	CreateSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/create-spot.use-case';
import {
	DeleteSpotUseCase,
	DeleteSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/delete-spot.use-case';
import {
	FavoriteSpotUseCase,
	FavoriteSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/favorite-spot.use-case';
import {
	GetSpotUseCase,
	GetSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/get-spot.use-case';
import {
	ListSpotsUseCase,
	ListSpotsUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/list-spots.use-case';
import {
	UnfavoriteSpotUseCase,
	UnfavoriteSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/unfavorite-spot.use-case';
import {
	UnvisitSpotUseCase,
	UnvisitSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/unvisit-spot.use.case';
import {
	UpdateSpotUseCase,
	UpdateSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/update-spot.use-case';
import {
	VisitSpotUseCase,
	VisitSpotUseCaseProvider,
} from 'src/spot/application/ports/in/use-cases/visit-spot.use.case';
import { CreateSpotDto } from 'src/spot/application/ports/out/dto/create-spot.dto';
import { GetSpotDto } from 'src/spot/application/ports/out/dto/get-spot.dto';
import { SpotErrorHandler } from './handlers/spot-error.handler';
import { SpotRequestMapper } from './mappers/spot-request.mapper';
import { CreateSpotRequest } from './requests/create-spot.request';
import { ListSpotsQueryRequest } from './requests/list-spot-query.request';
import { UpdateSpotRequest } from './requests/update-spot.request';

@ApiTags('Spots')
@ApiUnauthorizedResponse({
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
@Controller('spots')
@UseFilters(new SpotErrorHandler())
export class SpotController extends ApiController {
	constructor(
		@Inject(CreateSpotUseCaseProvider)
		protected createSpotUseCase: CreateSpotUseCase,
		@Inject(UpdateSpotUseCaseProvider)
		protected updateSpotUseCase: UpdateSpotUseCase,
		@Inject(DeleteSpotUseCaseProvider)
		protected deleteSpotUseCase: DeleteSpotUseCase,
		@Inject(GetSpotUseCaseProvider)
		protected getSpotUseCase: GetSpotUseCase,
		@Inject(ListSpotsUseCaseProvider)
		protected listSpotsUseCase: ListSpotsUseCase,
		@Inject(FavoriteSpotUseCaseProvider)
		protected favoriteSpotUseCase: FavoriteSpotUseCase,
		@Inject(UnfavoriteSpotUseCaseProvider)
		protected unfavoriteSpotUseCase: UnfavoriteSpotUseCase,
		@Inject(VisitSpotUseCaseProvider)
		protected visitSpotUseCase: VisitSpotUseCase,
		@Inject(UnvisitSpotUseCaseProvider)
		protected unvisitSpotUseCase: UnvisitSpotUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List spots' })
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetSpotDto(
						'uuid',
						'string',
						'string',
						'string',
						{
							area: 'string',
							sub_area: 'string',
							locality: 'string',
							longitude: 0,
							latitude: 0,
							country_code: 'BR',
						},
						[{ id: 'uuid', file_path: 'string' }],
						'uuid',
						0,
						false,
						new Date(),
						false,
						new Date(),
						0,
						0,
						0,
						0,
						0,
						new Date(),
						new Date(),
					),
				],
				0,
				0,
				10,
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Get()
	public async list(
		@Query() query: ListSpotsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.listSpotsCommand(query);

		const data = await this.listSpotsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get spot' })
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
			data: new GetSpotDto(
				'uuid',
				'string',
				'string',
				'string',
				{
					area: 'string',
					sub_area: 'string',
					locality: 'string',
					longitude: 0,
					latitude: 0,
					country_code: 'BR',
				},
				[{ id: 'uuid', file_path: 'string' }],
				'uuid',
				0,
				false,
				new Date(),
				false,
				new Date(),
				0,
				0,
				0,
				0,
				0,
				new Date(),
				new Date(),
			),
		},
	})
	@UseGuards(AuthGuard)
	@Get(':id')
	public async get(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.getSpotCommand(id);

		const data = await this.getSpotUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create spot' })
	@ApiOkResponse({
		example: {
			data: new CreateSpotDto(
				'uuid',
				'string',
				'string',
				'string',
				{
					area: 'string',
					sub_area: 'string',
					locality: 'string',
					longitude: 0,
					latitude: 0,
					country_code: 'BR',
				},
				[{ id: 'uuid', file_path: 'string' }],
				'uuid',
				new Date(),
				new Date(),
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Post()
	public async create(
		@Body() body: CreateSpotRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.createSpotCommand(body);

		const data = await this.createSpotUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() body: UpdateSpotRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.updateSpotCommand(id, body);

		const data = await this.updateSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Delete spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.deleteSpotCommand(id);

		const data = await this.deleteSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Favorite spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@Post(':id/favorite')
	public async favorite(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.favoriteSpotCommand(id);

		const data = await this.favoriteSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Unfavorite spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@Delete(':id/unfavorite')
	public async unfavorite(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.unfavoriteSpotCommand(id);

		const data = await this.unfavoriteSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Visit spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@Post(':id/visit')
	public async visit(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.visitSpotCommand(id);

		const data = await this.visitSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Unvisit spot' })
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
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@Delete(':id/unvisit')
	public async unvisit(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotRequestMapper.unvisitSpotCommand(id);

		const data = await this.unvisitSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: data,
		});
	}
}
