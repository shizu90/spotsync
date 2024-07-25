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
	ApiExtraModels,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
	refs,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { Pagination } from 'src/common/common.repository';
import { ErrorResponse } from 'src/common/web/common-error.response';
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
	ListGroupRequestsUseCase,
	ListGroupRequestsUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-group-requests.use-case';
import {
	RefuseGroupRequestUseCase,
	RefuseGroupRequestUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/refuse-group-request.use-case';
import {
	RemoveGroupMemberUseCase,
	RemoveGroupMemberUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/remove-group-member.use-case';
import { AcceptGroupRequestDto } from 'src/group/application/ports/out/dto/accept-group-request.dto';
import { GetGroupMemberDto } from 'src/group/application/ports/out/dto/get-group-member.dto';
import { GetGroupRequestDto } from 'src/group/application/ports/out/dto/get-group-request.dto';
import { JoinGroupDto } from 'src/group/application/ports/out/dto/join-group.dto';
import { GroupErrorHandler } from './handlers/group-error.handler';
import { GroupMemberRequestMapper } from './mappers/group-member-request.mapper';
import { ChangeMemberRoleRequest } from './requests/change-member-role.request';
import { ListGroupMembersQueryRequest } from './requests/list-group-members-query.request';

@ApiTags('Group members')
@ApiUnauthorizedResponse({
	example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
})
@ApiNotFoundResponse({
	example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
})
@ApiInternalServerErrorResponse({
	example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
})
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
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetGroupMemberDto(
						'uuid',
						{
							id: 'uuid',
							credentials: { name: 'string' },
							first_name: 'string',
							last_name: 'string',
							banner_picture: 'string',
							profile_picture: 'string',
						},
						'uuid',
						{
							id: 'uuid',
							name: 'string',
							hex_color: '#000000',
							permissions: [{ id: 'uuid', name: 'string' }],
						},
						new Date(),
						false,
					),
				],
				1,
				0,
			),
		},
	})
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
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetGroupRequestDto(
						'uuid',
						{
							id: 'uuid',
							first_name: 'string',
							last_name: 'string',
							banner_picture: 'string',
							credentials: { name: 'string' },
							profile_picture: 'string',
						},
						'uuid',
						new Date(),
					),
				],
				1,
				0,
			),
		},
	})
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
	@ApiConflictResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiExtraModels(JoinGroupDto, AcceptGroupRequestDto)
	@ApiOkResponse({schema: {anyOf: refs(JoinGroupDto, AcceptGroupRequestDto)}})
	/*@ApiOkResponse({
		example: {
			data: new JoinGroupDto('uuid', 'uuid', 'uuid', new Date()),
		},
	})
	@ApiOkResponse({
		example: {
			data: new AcceptGroupRequestDto(
				'uuid',
				{
					id: 'uuid',
					banner_picture: 'string',
					credentials: { name: 'string' },
					first_name: 'string',
					last_name: 'string',
					profile_picture: 'string',
				},
				new Date(),
				{
					name: 'string',
					hex_color: 'string',
					permissions: [{ id: 'uuid', name: 'string' }],
				},
			),
		},
	})*/
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
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
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
	@ApiOkResponse({ example: { data: {} } })
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
	@ApiConflictResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({
		example: {
			data: new AcceptGroupRequestDto(
				'uuid',
				{
					id: 'uuid',
					banner_picture: 'string',
					credentials: { name: 'string' },
					first_name: 'string',
					last_name: 'string',
					profile_picture: 'string',
				},
				new Date(),
				{
					name: 'string',
					hex_color: 'string',
					permissions: [{ id: 'uuid', name: 'string' }],
				},
			),
		},
	})
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
	@ApiConflictResponse({
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
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
		example: new ErrorResponse('string', '2024-07-24 12:00:00', 'string'),
	})
	@ApiOkResponse({ example: { data: {} } })
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
