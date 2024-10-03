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
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import {
	CreateCommentUseCase,
	CreateCommentUseCaseProvider,
} from 'src/comment/application/ports/in/use-cases/create-comment.use-case';
import {
	DeleteCommentUseCase,
	DeleteCommentUseCaseProvider,
} from 'src/comment/application/ports/in/use-cases/delete-comment.use-case';
import {
	ListCommentsUseCase,
	ListCommentsUseCaseProvider,
} from 'src/comment/application/ports/in/use-cases/list-comments.use-case';
import {
	UpdateCommentUseCase,
	UpdateCommentUseCaseProvider,
} from 'src/comment/application/ports/in/use-cases/update-comment.use-case';
import { CommentDto } from 'src/comment/application/ports/out/dto/comment.dto';
import { Pagination } from 'src/common/core/common.repository';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import { CommentErrorHandler } from './handlers/comment-error.handler';
import { CommentRequestMapper } from './mappers/comment-request.mapper';
import { CreateCommentRequest } from './requests/create-comment.request';
import { ListCommentsQueryRequest } from './requests/list-comments-query.request';
import { UpdateCommentRequest } from './requests/update-comment.request';

@ApiTags('Comments')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('comments')
@UseGuards(AuthGuard)
@UseFilters(new CommentErrorHandler())
export class CommentController extends ApiController {
	constructor(
		@Inject(CreateCommentUseCaseProvider)
		protected createCommentUseCase: CreateCommentUseCase,
		@Inject(UpdateCommentUseCaseProvider)
		protected updateCommentUseCase: UpdateCommentUseCase,
		@Inject(DeleteCommentUseCaseProvider)
		protected deleteCommentUseCase: DeleteCommentUseCase,
		@Inject(ListCommentsUseCaseProvider)
		protected listCommentsUseCase: ListCommentsUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List comments' })
	@ApiOkResponse({ type: Pagination<CommentDto> })
	@Get()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	public async list(
		@Query() query: ListCommentsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = CommentRequestMapper.listCommentsCommand(query);

		const data = await this.listCommentsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create comment' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiCreatedResponse({ type: CommentDto })
	@Post()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	public async create(
		@Body() body: CreateCommentRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = CommentRequestMapper.createCommentCommand(body);

		const data = await this.createCommentUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update comment' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@Put(':id')
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	public async update(
		@Param('id') id: string,
		@Body() body: UpdateCommentRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = CommentRequestMapper.updateCommentCommand(id, body);

		await this.updateCommentUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete comment' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = CommentRequestMapper.deleteCommentCommand(id);

		await this.deleteCommentUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
