import {
	Controller,
	Get,
	HttpStatus,
	Inject,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { Pagination } from 'src/common/core/common.repository';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	ListThreadsUseCase,
	ListThreadsUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/list-threads.use-case';
import { GetPostDto } from 'src/post/application/ports/out/dto/get-post.dto';
import { PostErrorHandler } from './handlers/post-error.handler';
import { PostRequestMapper } from './mappers/post-request.mapper';
import { ListThreadsQueryRequest } from './requests/list-threads-query.request';

@ApiTags('Posts')
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
@Controller('threads')
@UseFilters(new PostErrorHandler())
export class PostThreadController {
	constructor(
		@Inject(ListThreadsUseCaseProvider)
		protected listThreadsUseCase: ListThreadsUseCase,
	) {}

	@ApiOperation({ summary: 'List threads' })
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetPostDto(
						'uuid',
						'string',
						'string',
						[
							{
								id: 'uuid',
								file_path: 'string',
								file_type: 'string',
							},
						],
						{
							id: 'uuid',
							display_name: 'string',
							profile_theme_color: '#000000',
							profile_picture: 'string',
							banner_picture: 'string',
							credentials: { name: 'string' },
						},
						'public',
						0,
						'uuid',
						new Date(),
						new Date(),
						'uuid',
						'uuid',
						[],
						1,
						0,
						false,
					),
				],
				1,
				0,
				10,
			),
		},
	})
	@UseGuards(AuthGuard)
	@Get()
	public async list(
		@Query() query: ListThreadsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.listThreadsCommand(query);

		const data = await this.listThreadsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}
}
