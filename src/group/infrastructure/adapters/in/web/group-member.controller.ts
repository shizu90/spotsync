import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	AcceptGroupRequestUseCase,
	AcceptGroupRequestUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/accept-group-request.use-case';
import {
	ChangeMemberRoleUseCase,
	ChangeMemberRoleUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/change-member-role.use-case';
import {
	JoinGroupUseCase,
	JoinGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/join-group.use-case';
import {
	LeaveGroupUseCase,
	LeaveGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/leave-group.use-case';
import {
	ListGroupMembersUseCase,
	ListGroupMembersUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-group-members.use-case';
import {
	RefuseGroupRequestUseCase,
	RefuseGroupRequestUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/refuse-group-request.use-case';
import {
	RemoveGroupMemberUseCase,
	RemoveGroupMemberUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/remove-group-member.use-case';
import { GroupErrorHandler } from './handlers/group-error.handler';
import { GroupMemberRequestMapper } from './mappers/group-member-request.mapper';
import { ChangeMemberRoleRequest } from './requests/change-member-role.request';
import { ListGroupMembersQueryRequest } from './requests/list-group-members-query.request';

@ApiTags('Group members')
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
@UseFilters(new GroupErrorHandler())
@Controller('groups')
export class GroupMemberController extends ApiController {
	constructor(
		@Inject(ListGroupMembersUseCaseProvider)
		protected listGroupMembersUseCase: ListGroupMembersUseCase,
		@Inject(JoinGroupUseCaseProvider)
		protected joinGroupUseCase: JoinGroupUseCase,
		@Inject(LeaveGroupUseCaseProvider)
		protected leaveGroupUseCase: LeaveGroupUseCase,
		@Inject(ChangeMemberRoleUseCaseProvider)
		protected changeMemberRoleUseCase: ChangeMemberRoleUseCase,
		@Inject(AcceptGroupRequestUseCaseProvider)
		protected acceptGroupRequestUseCase: AcceptGroupRequestUseCase,
		@Inject(RefuseGroupRequestUseCaseProvider)
		protected refuseGroupRequestUseCase: RefuseGroupRequestUseCase,
		@Inject(RemoveGroupMemberUseCaseProvider)
		protected removeGroupMemberUseCase: RemoveGroupMemberUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List group members' })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Get(':id/members')
	public async list(
		@Param('id') groupId: string,
		@Query() query: ListGroupMembersQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.listGroupMembersCommand(
			groupId,
			query,
		);

		const data = await this.listGroupMembersUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Join group' })
	@ApiConflictResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Post(':id/join')
	public async joinGroup(
		@Param('id') groupId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.joinGroupCommand(groupId);

		const data = await this.joinGroupUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Leave group' })
	@ApiUnprocessableEntityResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id/leave')
	public async leaveGroup(
		@Param('id') groupId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.leaveGroupCommand(groupId);

		await this.leaveGroupUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Change member role' })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Patch(':id/members/:member_id/change-role')
	public async changeMemberRole(
		@Param('id') groupId: string,
		@Param('member_id') memberId: string,
		@Body() body: ChangeMemberRoleRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.changeMemberRoleCommand(
			groupId,
			memberId,
			body,
		);

		await this.changeMemberRoleUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Accept group request' })
	@ApiConflictResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Patch(':id/join-requests/:request_id/accept')
	public async acceptGroupRequest(
		@Param('id') groupId: string,
		@Param('request_id') requestId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.acceptGroupRequestCommand(
			groupId,
			requestId,
		);

		const data = await this.acceptGroupRequestUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Refuse group request' })
	@ApiConflictResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id/join-requests/:request_id/refuse')
	public async refuseGroupRequest(
		@Param('id') groupId: string,
		@Param('request_id') requestId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.refuseGroupRequestCommand(
			groupId,
			requestId,
		);

		await this.refuseGroupRequestUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Remove group member' })
	@ApiConflictResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id/members/:member_id')
	public async removeGroupMember(
		@Param('id') groupId: string,
		@Param('member_id') memberId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.removeGroupMemberCommand(
			groupId,
			memberId,
		);

		await this.removeGroupMemberUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
