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
import { CreatePostDto } from 'src/post/application/ports/out/dto/create-post.dto';
import { GetPostDto } from 'src/post/application/ports/out/dto/get-post.dto';
import { PostErrorHandler } from './handlers/post-error.handler';
import { PostRequestMapper } from './mappers/post-request.mapper';
import { CreatePostRequest } from './requests/create-post.request';

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
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
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
			data: new GetPostDto(
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
					first_name: 'string',
					last_name: 'string',
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
							first_name: 'string',
							last_name: 'string',
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
						0,
						0,
						false,
					),
				],
				1,
				0,
				false,
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
		const command = PostRequestMapper.getPostCommand(id);

		const post = await this.getPostUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: post,
		});
	}

	@ApiOperation({ summary: 'Create post' })
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
			data: new CreatePostDto(
				'uuid',
				'string',
				'string',
				'public',
				[{ id: 'uuid', file_path: 'string', file_type: 'string' }],
				'uuid',
				0,
				'uuid',
				'uuid',
				'uuid',
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Post()
	public async create(
		@Body() body: CreatePostRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.createPostCommand(body);

		const post = await this.createPostUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: post,
		});
	}

	@ApiOperation({ summary: 'Update post' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse({
		example: {
			data: {},
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() Body,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = PostRequestMapper.updatePostCommand(id, Body);

		await this.updatePostUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Delete post' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse({
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
		const command = PostRequestMapper.deletePostCommand(id);

		await this.deletePostUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
