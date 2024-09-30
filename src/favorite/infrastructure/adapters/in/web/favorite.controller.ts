import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	FavoriteUseCase,
	FavoriteUseCaseProvider,
} from 'src/favorite/application/ports/in/use-cases/favorite.use-case';
import {
	ListFavoritesUseCase,
	ListFavoritesUseCaseProvider,
} from 'src/favorite/application/ports/in/use-cases/list-favorites.use-case';
import {
	UnfavoriteUseCase,
	UnfavoriteUseCaseProvider,
} from 'src/favorite/application/ports/in/use-cases/unfavorite.use-case';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { FavoriteErrorHandler } from './handlers/favorite-error.handler';
import { FavoriteRequestMapper } from './mappers/favorite-request.mapper';
import { FavoriteRequest } from './requests/favorite.request';
import { ListFavoritesQueryRequest } from './requests/list-favorites-query.request';

@ApiTags('Favorites')
@ApiUnauthorizedResponse({
	example: new ErrorResponse(
		'string',
		new Date().toISOString(),
		'string',
		'string',
	),
})
@ApiInternalServerErrorResponse({
	example: new ErrorResponse(
		'string',
		new Date().toISOString(),
		'string',
		'string',
	),
})
@ApiForbiddenResponse({
	example: new ErrorResponse(
		'string',
		new Date().toISOString(),
		'string',
		'string',
	),
})
@Controller('favorites')
@UseFilters(new FavoriteErrorHandler())
export class FavoriteController extends ApiController {
	constructor(
		@Inject(FavoriteUseCaseProvider)
		protected favoriteUseCase: FavoriteUseCase,
		@Inject(UnfavoriteUseCaseProvider)
		protected unfavoriteUseCase: UnfavoriteUseCase,
		@Inject(ListFavoritesUseCaseProvider)
		protected listFavoritesUseCase: ListFavoritesUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List favorites of a subject' })
	@UseGuards(AuthGuard)
	@Get()
	public async list(
		@Query() query: ListFavoritesQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.listFavoritesCommand(query);

		const data = await this.listFavoritesUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Favorite a subject' })
	@UseGuards(AuthGuard)
	@Post()
	public async favorite(
		@Body() body: FavoriteRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.favoriteCommand(body);

		const data = await this.favoriteUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Unfavorite a subject' })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':subject/:subject_id')
	public async unfavorite(
		@Param('subject') subject: FavoritableSubject,
		@Param('subject_id') subject_id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.unfavoriteCommand(
			subject,
			subject_id,
		);

		await this.unfavoriteUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
