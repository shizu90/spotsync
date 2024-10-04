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
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
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
    CreateGroupRoleUseCase,
    CreateGroupRoleUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/create-group-role.use-case';
import {
    GetGroupRoleUseCase,
    GetGroupRoleUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/get-group-role.use-case';
import {
    ListGroupRolesUseCase,
    ListGroupRolesUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-group-roles.use-case';
import {
    RemoveGroupRoleUseCase,
    RemoveGroupRoleUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/remove-group-role.use-case';
import {
    UpdateGroupRoleUseCase,
    UpdateGroupRoleUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/update-group-role.use-case';
import { GroupRoleDto } from 'src/group/application/ports/out/dto/group-role.dto';
import { GroupErrorHandler } from './handlers/group-error.handler';
import { GroupRoleRequestMapper } from './mappers/group-role-request.mapper';
import { CreateGroupRoleRequest } from './requests/create-group-role.request';
import { ListGroupRolesQueryRequest } from './requests/list-group-roles-query.request';
import { UpdateGroupRoleRequest } from './requests/update-group-role.request';

@ApiTags('Group roles')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@UseFilters(new GroupErrorHandler())
@Controller('groups')
export class GroupRoleController extends ApiController {
	constructor(
		@Inject(CreateGroupRoleUseCaseProvider)
		protected createGroupRoleUseCase: CreateGroupRoleUseCase,
		@Inject(UpdateGroupRoleUseCaseProvider)
		protected updateGroupRoleUseCase: UpdateGroupRoleUseCase,
		@Inject(RemoveGroupRoleUseCaseProvider)
		protected removeGroupRoleUseCase: RemoveGroupRoleUseCase,
		@Inject(ListGroupRolesUseCaseProvider)
		protected listGroupRolesUseCase: ListGroupRolesUseCase,
		@Inject(GetGroupRoleUseCaseProvider)
		protected getGroupRoleUseCase: GetGroupRoleUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List group roles' })
	@ApiOkResponse({ type: Array<GroupRoleDto> })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Get(':id/roles')
	public async list(
		@Param('id') groupId: string,
		@Query() query: ListGroupRolesQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRoleRequestMapper.listGroupRolesCommand(
			groupId,
			query,
		);

		const data = await this.listGroupRolesUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get group role by id' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: GroupRoleDto })
	@UseGuards(AuthGuard)
	@Get(':id/roles/:role_id')
	public async getById(
		@Param('id') groupId: string,
		@Param('role_id') roleId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRoleRequestMapper.getGroupRoleCommand(
			groupId,
			roleId,
		);

		const data = await this.getGroupRoleUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create group role' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiCreatedResponse({ type: GroupRoleDto })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post(':id/roles')
	public async create(
		@Param('id') groupId: string,
		@Body() body: CreateGroupRoleRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRoleRequestMapper.createGroupRoleCommand(
			groupId,
			body,
		);

		const data = await this.createGroupRoleUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update group role' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/roles/:role_id')
	public async update(
		@Param('id') groupId: string,
		@Param('role_id') roleId: string,
		@Body() body: UpdateGroupRoleRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRoleRequestMapper.updateGroupRoleCommand(
			groupId,
			roleId,
			body,
		);

		await this.updateGroupRoleUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete group role' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id/roles/:role_id')
	public async delete(
		@Param('id') groupId: string,
		@Param('role_id') roleId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRoleRequestMapper.removeGroupRoleCommand(
			groupId,
			roleId,
		);

		await this.removeGroupRoleUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
