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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	LikeUseCase,
	LikeUseCaseProvider,
} from 'src/like/application/ports/in/use-cases/like.use-case';
import {
	ListLikesUseCase,
	ListLikesUseCaseProvider,
} from 'src/like/application/ports/in/use-cases/list-likes.use-case';
import {
	UnlikeUseCase,
	UnlikeUseCaseProvider,
} from 'src/like/application/ports/in/use-cases/unlike.use-case';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { LikeErrorHandler } from './handlers/like-error.handler';
import { LikeRequestMapper } from './mappers/like-request.mapper';
import { LikeRequest } from './requests/like.request';
import { ListLikesQueryRequest } from './requests/list-likes-query.request';

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
@ApiTags('Likes')
@Controller('likes')
@UseFilters(new LikeErrorHandler())
export class LikeController extends ApiController {
	constructor(
		@Inject(LikeUseCaseProvider)
		protected likeUseCase: LikeUseCase,
		@Inject(UnlikeUseCaseProvider)
		protected unlikeUseCase: UnlikeUseCase,
		@Inject(ListLikesUseCaseProvider)
		protected listLikesUseCase: ListLikesUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List likes of a subject' })
	@UseGuards(AuthGuard)
	@Get()
	public async list(
		@Query() query: ListLikesQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = LikeRequestMapper.listLikesCommand(query);

		const data = await this.listLikesUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Like a subject' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Post()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	public async like(
		@Body() body: LikeRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = LikeRequestMapper.likeCommand(body);

		const data = await this.likeUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Unlike a subject' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
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
	@Delete(':subject/:subjectId')
	public async unlike(
		@Param('subject') subject: LikableSubject,
		@Param('subjectId') subjectId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = LikeRequestMapper.unlikeCommand(subject, subjectId);

		await this.unlikeUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
