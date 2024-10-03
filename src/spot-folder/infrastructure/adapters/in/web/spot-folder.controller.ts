import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Patch,
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
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNoContentResponse,
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
	AddSpotUseCase,
	AddSpotUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/add-spot.use-case';
import {
	CreateSpotFolderUseCase,
	CreateSpotFolderUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/create-spot-folder.use-case';
import {
	DeleteSpotFolderUseCase,
	DeleteSpotFolderUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/delete-spot-folder.use-case';
import {
	GetSpotFolderUseCase,
	GetSpotFolderUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/get-spot-folder.use-case';
import {
	ListSpotFoldersUseCase,
	ListSpotFoldersUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/list-spot-folders.use-case';
import {
	RemoveSpotUseCase,
	RemoveSpotUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/remove-spot.use-case';
import {
	SortItemsUseCase,
	SortItemsUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/sort-items.use-case';
import {
	UpdateSpotFolderUseCase,
	UpdateSpotFolderUseCaseProvider,
} from 'src/spot-folder/application/ports/in/use-cases/update-spot-folder.use-case';
import { SpotFolderDto } from 'src/spot-folder/application/ports/out/dto/spot-folder.dto';
import { SpotFolderErrorHandler } from './handlers/spot-folder-error.handler';
import { SpotFolderRequestMapper } from './mappers/spot-folder-request.mapper';
import { AddSpotRequest } from './requests/add-spot.request';
import { CreateSpotFolderRequest } from './requests/create-spot-folder.request';
import { ListSpotFoldersQueryRequest } from './requests/list-spot-folders-query.request';
import { SortItemsRequest } from './requests/sort-items.request';
import { UpdateSpotFolderRequest } from './requests/update-spot-folder.request';

@ApiTags('Spot folders')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('spot-folders')
@UseFilters(new SpotFolderErrorHandler())
export class SpotFolderController extends ApiController {
	constructor(
		@Inject(GetSpotFolderUseCaseProvider)
		protected getSpotFolderUseCase: GetSpotFolderUseCase,
		@Inject(ListSpotFoldersUseCaseProvider)
		protected listSpotFoldersUseCase: ListSpotFoldersUseCase,
		@Inject(CreateSpotFolderUseCaseProvider)
		protected createSpotFolderUseCase: CreateSpotFolderUseCase,
		@Inject(UpdateSpotFolderUseCaseProvider)
		protected updateSpotFolderUseCase: UpdateSpotFolderUseCase,
		@Inject(SortItemsUseCaseProvider)
		protected sortItemsUseCase: SortItemsUseCase,
		@Inject(DeleteSpotFolderUseCaseProvider)
		protected deleteSpotFolderUseCase: DeleteSpotFolderUseCase,
		@Inject(AddSpotUseCaseProvider)
		protected addSpotUseCase: AddSpotUseCase,
		@Inject(RemoveSpotUseCaseProvider)
		protected removeSpotUseCase: RemoveSpotUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List spot folders' })
	@ApiOkResponse({ type: Pagination<SpotFolderDto> })
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
		@Query() query: ListSpotFoldersQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.listSpotFoldersCommand(query);

		const data = await this.listSpotFoldersUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get spot folder' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: SpotFolderDto })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Get(':id')
	public async get(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.getSpotFolderCommand(id);

		const data = await this.getSpotFolderUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create spot folder' })
	@ApiCreatedResponse({ type: SpotFolderDto })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post()
	public async create(
		@Body() body: CreateSpotFolderRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.createSpotFolderCommand(body);

		const data = await this.createSpotFolderUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update spot folder' })
	@ApiNoContentResponse()
	@ApiNotFoundResponse({ type: ErrorResponse })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() body: UpdateSpotFolderRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.updateSpotFolderCommand(
			id,
			body,
		);

		await this.updateSpotFolderUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete spot folder' })
	@ApiNoContentResponse()
	@ApiNotFoundResponse({ type: ErrorResponse })
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.deleteSpotFolderCommand(id);

		await this.deleteSpotFolderUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Sort items' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: SpotFolderDto })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Patch(':id/sort')
	public async sort(
		@Param('id') id: string,
		@Body() body: SortItemsRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.sortItemsCommand(id, body);

		const data = await this.sortItemsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Add spots' })
	@ApiNoContentResponse()
	@ApiNotFoundResponse({ type: ErrorResponse })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post(':id/spots')
	public async addSpots(
		@Param('id') id: string,
		@Body() body: AddSpotRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.addSpotCommand(id, body);

		await this.addSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Remove spots' })
	@ApiNoContentResponse()
	@ApiNotFoundResponse({ type: ErrorResponse })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Delete(':id/spots/:spot_id')
	public async removeSpots(
		@Param('id') id: string,
		@Param('spot_id') spotId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = SpotFolderRequestMapper.removeSpotCommand(id, spotId);

		await this.removeSpotUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
