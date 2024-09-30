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
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	CreateGroupUseCase,
	CreateGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/create-group.use-case';
import {
	DeleteGroupUseCase,
	DeleteGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/delete-group.use-case';
import {
	GetGroupHistoryUseCase,
	GetGroupHistoryUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/get-group-history.use-case';
import {
	GetGroupUseCase,
	GetGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/get-group.use-case';
import {
	ListGroupsUseCase,
	ListGroupsUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-groups.use-case';
import {
	UpdateGroupVisibilityUseCase,
	UpdateGroupVisibilityUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/update-group-visibility.use-case';
import {
	UpdateGroupUseCase,
	UpdateGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/update-group.use-case';
import { GroupErrorHandler } from './handlers/group-error.handler';
import { GroupRequestMapper } from './mappers/group-request.mapper';
import { CreateGroupRequest } from './requests/create-group.request';
import { ListGroupsQueryRequest } from './requests/list-groups-query.request';
import { UpdateGroupVisibilityRequest } from './requests/update-group-visibility.request';
import { UpdateGroupRequest } from './requests/update-group.request';

@ApiTags('Groups')
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
@UseFilters(new GroupErrorHandler())
@Controller('groups')
export class GroupController extends ApiController {
	constructor(
		@Inject(CreateGroupUseCaseProvider)
		protected createGroupUseCase: CreateGroupUseCase,
		@Inject(UpdateGroupUseCaseProvider)
		protected updateGroupUseCase: UpdateGroupUseCase,
		@Inject(UpdateGroupVisibilityUseCaseProvider)
		protected updateGroupVisibilityUseCase: UpdateGroupVisibilityUseCase,
		@Inject(DeleteGroupUseCaseProvider)
		protected deleteGroupUseCase: DeleteGroupUseCase,
		@Inject(ListGroupsUseCaseProvider)
		protected listGroupsUseCase: ListGroupsUseCase,
		@Inject(GetGroupUseCaseProvider)
		protected getGroupUseCase: GetGroupUseCase,
		@Inject(GetGroupHistoryUseCaseProvider)
		protected getGroupHistoryUseCase: GetGroupHistoryUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List groups' })
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
		@Query() query: ListGroupsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.listGroupsCommand(query);

		const data = await this.listGroupsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Find group by id' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Get(':id')
	public async getById(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupCommand(id);

		const data = await this.getGroupUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create group' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
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
		@Body() request: CreateGroupRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.createGroupCommand(request);

		const data = await this.createGroupUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update group' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
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
		@Body() request: UpdateGroupRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.updateGroupCommand(id, request);

		await this.updateGroupUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Update group visibility' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/visibility')
	public async updateVisibility(
		@Param('id') id: string,
		@Body() request: UpdateGroupVisibilityRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.updateGroupVisibilityCommand(
			id,
			request,
		);

		await this.updateGroupVisibilityUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete group' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.deleteGroupCommand(id);

		await this.deleteGroupUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Get group history' })
	@ApiNotFoundResponse({
		example: new ErrorResponse(
			'string',
			new Date().toISOString(),
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Get(':id/history')
	public async getHistory(
		@Param('id') id: string,
		@Query() query: ListGroupsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupHistoryCommand(id, query);

		const data = await this.getGroupHistoryUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}
}
