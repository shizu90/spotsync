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
	UploadedFiles,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
	CreatePostUseCase,
	CreatePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/create-post.use-case';
import {
	DeletePostUseCase,
	DeletePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/delete-post.use-case';
import { GetAttachmentUseCase, GetAttachmentUseCaseProvider } from 'src/post/application/ports/in/use-cases/get-attachment.use-case';
import {
	GetPostUseCase,
	GetPostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/get-post.use-case';
import {
	UpdatePostUseCase,
	UpdatePostUseCaseProvider,
} from 'src/post/application/ports/in/use-cases/update-post.use-case';
import { PostDto } from 'src/post/application/ports/out/dto/post.dto';
import { PostErrorHandler } from './handlers/post-error.handler';
import { PostRequestMapper } from './mappers/post-request.mapper';
import { CreatePostRequest } from './requests/create-post.request';
import { UpdatePostRequest } from './requests/update-post.request';

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
		@Inject(GetAttachmentUseCaseProvider)
		protected getAttachmentUseCase: GetAttachmentUseCase
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
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'attachments', maxCount: 5 },
			],
		)
	)
	@Post()
	public async create(
		@Body() body: CreatePostRequest,
		@UploadedFiles() files: { attachments?: Express.Multer.File[] },
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.createPostCommand(body, files?.attachments);

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
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'attachments', maxCount: 5 },
			]
		)
	)
	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() body: UpdatePostRequest,
		@UploadedFiles() files: { attachments?: Express.Multer.File[] },
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.updatePostCommand(id, body, files?.attachments);

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

	@ApiOperation({ summary: 'Get post attachment' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiUnauthorizedResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Get(':id/attachments/:attachmentId')
	public async getAttachment(
		@Param('id') id: string,
		@Param('attachmentId') attachmentId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.getAttachmentCommand(id, attachmentId);

		const readStream = await this.getAttachmentUseCase.execute(command);

		readStream.pipe(res);
	}
}
