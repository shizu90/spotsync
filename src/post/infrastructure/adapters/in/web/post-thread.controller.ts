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
import { ErrorResponse } from 'src/common/web/common.error';
import {
    ListThreadsUseCase,
    ListThreadsUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/list-threads.use-case';
import { PostDto } from 'src/post/application/ports/out/dto/post.dto';
import { PostErrorHandler } from './handlers/post-error.handler';
import { PostRequestMapper } from './mappers/post-request.mapper';
import { ListThreadsQueryRequest } from './requests/list-threads-query.request';

@ApiTags('Posts')
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('threads')
@UseFilters(new PostErrorHandler())
export class PostThreadController {
	constructor(
		@Inject(ListThreadsUseCaseProvider)
		protected listThreadsUseCase: ListThreadsUseCase,
	) {}

	@ApiOperation({ summary: 'List threads' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: Array<PostDto> })
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
