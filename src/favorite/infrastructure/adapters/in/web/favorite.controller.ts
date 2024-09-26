import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { Pagination } from "src/common/core/common.repository";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { FavoriteUseCase, FavoriteUseCaseProvider } from "src/favorite/application/ports/in/use-cases/favorite.use-case";
import { ListFavoritesUseCase, ListFavoritesUseCaseProvider } from "src/favorite/application/ports/in/use-cases/list-favorites.use-case";
import { UnfavoriteUseCase, UnfavoriteUseCaseProvider } from "src/favorite/application/ports/in/use-cases/unfavorite.use-case";
import { FavoriteDto } from "src/favorite/application/ports/out/dto/favorite.dto";
import { GetFavoriteDto } from "src/favorite/application/ports/out/dto/get-favorite.dto";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { FavoriteErrorHandler } from "./handlers/favorite-error.handler";
import { FavoriteRequestMapper } from "./mappers/favorite-request.mapper";
import { FavoriteRequest } from "./requests/favorite.request";
import { ListFavoritesQueryRequest } from "./requests/list-favorites-query.request";

@ApiTags("Favorites")
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
@Controller("favorites")
@UseFilters(new FavoriteErrorHandler())
export class FavoriteController extends ApiController {
	constructor(
		@Inject(FavoriteUseCaseProvider)
		protected favoriteUseCase: FavoriteUseCase,
		@Inject(UnfavoriteUseCaseProvider)
		protected unfavoriteUseCase: UnfavoriteUseCase,
		@Inject(ListFavoritesUseCaseProvider)
		protected listFavoritesUseCase: ListFavoritesUseCase,
	) {super();}

	@ApiOperation({ summary: "List favorites of a subject"})
	@ApiOkResponse({
		example: {
			data: new Pagination([
				new GetFavoriteDto(
					'uuid',
					new Date().toISOString(),
					{
						id: 'uuid',
						name: 'string',
						description: 'description',
						type: 'string',
						creator: {
							id: 'uuid',
							display_name: 'string',
							credentials: {
								name: 'string',
							},
							profile_picture: 'string',
						},
						address: {
							area: 'string',
							country_code: 'BR',
							latitude: 0,
							locality: 'string',
							longitude: 0,
							sub_area: 'string',
						},
						photos: [
							{
								file_path: 'string',
								id: 'uuid',
							}
						]
					},
				)
			], 1, 1, 12)
		}
	})
	@UseGuards(AuthGuard)
	@Get()
	public async list(
		@Query() query: ListFavoritesQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.listFavoritesCommand(query);

		const data = await this.listFavoritesUseCase.execute(command);

		res.status(HttpStatus.OK)
			.json({
				data: data
			});
	}

	@ApiOperation({ summary: "Favorite a subject" })
	@ApiOkResponse({
		example: {
			data: new FavoriteDto(
				'uuid',
				'string',
				'uuid',
				'uuid',
				new Date().toISOString(),
			)
		}
	})
	@UseGuards(AuthGuard)
	@Post()
	public async favorite(
		@Body() body: FavoriteRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.favoriteCommand(body);

		const data = await this.favoriteUseCase.execute(command);

		res.status(HttpStatus.OK)
			.json({
				data: data
			});
	}

	@ApiOperation({ summary: "Unfavorite a subject" })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(":subject/:subject_id")
	public async unfavorite(
		@Param("subject") subject: FavoritableSubject,
		@Param("subject_id") subject_id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FavoriteRequestMapper.unfavoriteCommand(subject, subject_id);

		await this.unfavoriteUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT)
			.json({
				data: {}
			});
	}
}