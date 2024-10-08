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
import { ErrorResponse } from 'src/common/web/common.error';
import {
	AddPostAttachmentUseCase,
	AddPostAttachmentUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/add-post-attachment.use-case';
import {
	CreatePostUseCase,
	CreatePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/create-post.use-case';
import {
	DeletePostUseCase,
	DeletePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/delete-post.use-case';
import {
	GetPostUseCase,
	GetPostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/get-post.use-case';
import {
	RemovePostAttachmentUseCase,
	RemovePostAttachmentUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/remove-post-attachment.use-case';
import {
	UpdatePostUseCase,
	UpdatePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/update-post.use-case';
import { PostDto } from 'src/post/application/ports/out/dto/post.dto';
import { PostErrorHandler } from './handlers/post-error.handler';
import { PostRequestMapper } from './mappers/post-request.mapper';
import { CreatePostRequest } from './requests/create-post.request';

@ApiTags('Posts')
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('posts')
@UseFilters(new PostErrorHandler())
export class PostController {
	constructor(
		@Inject(GetPostUseCaseProvider)
		protected getPostUseCase: GetPostUseCase,
		@Inject(CreatePostUseCaseProvider)
		protected createPostUseCase: CreatePostUseCase,
		@Inject(UpdatePostUseCaseProvider)
		protected updatePostUseCase: UpdatePostUseCase,
		@Inject(DeletePostUseCaseProvider)
		protected deletePostUseCase: DeletePostUseCase,
		@Inject(AddPostAttachmentUseCaseProvider)
		protected addPostAttachmentUseCase: AddPostAttachmentUseCase,
		@Inject(RemovePostAttachmentUseCaseProvider)
		protected removePostAttachmentUseCase: RemovePostAttachmentUseCase,
	) {}

	@ApiOperation({ summary: 'Get post by id' })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: PostDto })
	@UseGuards(AuthGuard)
	@Get(':id')
	public async get(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.getPostCommand(id);

		const post = await this.getPostUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: post,
		});
	}

	@ApiOperation({ summary: 'Create post' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiCreatedResponse({ type: PostDto })
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
		@Body() body: CreatePostRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.createPostCommand(body);

		const post = await this.createPostUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: post,
		});
	}

	@ApiOperation({ summary: 'Update post' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
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
		@Body() Body,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.updatePostCommand(id, Body);

		await this.updatePostUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete post' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.deletePostCommand(id);

		await this.deletePostUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
