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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
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
import { ListGroupMembersQueryRequest } from './requests/list-group-members-query.request';
import { GroupMemberRequestMapper } from './mappers/group-member-request.mapper';
import { ChangeMemberRoleRequest } from './requests/change-member-role.request';
import { GroupErrorHandler } from './handlers/group-error.handler';
import {
	RemoveGroupMemberUseCase,
	RemoveGroupMemberUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/remove-group-member.use-case';
import {
	ListGroupRequestsUseCase,
	ListGroupRequestsUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-group-requests.use-case';

@ApiTags('Group members')
@UseFilters(new GroupErrorHandler())
@Controller('groups')
export class GroupMemberController {
	constructor(
		@Inject(ListGroupMembersUseCaseProvider)
		protected listGroupMembersUseCase: ListGroupMembersUseCase,
		@Inject(ListGroupRequestsUseCaseProvider)
		protected listGroupRequestsUseCase: ListGroupRequestsUseCase,
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
	) {}

	@ApiOperation({ summary: 'List group members' })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
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

	@ApiOperation({ summary: 'List group join requests' })
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	@Get(':id/join-requests')
	public async listRequests(
		@Param('id') groupId: string,
		@Query() query: ListGroupMembersQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupMemberRequestMapper.listGroupRequestsCommand(
			groupId,
			query,
		);

		const data = await this.listGroupRequestsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Join group' })
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
	@UseGuards(AuthGuard)
	@Put(':id/members/:member_id/change-role')
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
	@UseGuards(AuthGuard)
	@Put(':id/join-requests/:request_id/accept')
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
