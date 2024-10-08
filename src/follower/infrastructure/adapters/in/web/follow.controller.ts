import {
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
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
    AcceptFollowRequestUseCase,
    AcceptFollowRequestUseCaseProvider,
} from 'src/follower/application/ports/in/use-cases/accept-follow-request.use-case';
import {
    FollowUseCase,
    FollowUseCaseProvider,
} from 'src/follower/application/ports/in/use-cases/follow.use-case';
import {
    ListFollowsUseCase,
    ListFollowsUseCaseProvider,
} from 'src/follower/application/ports/in/use-cases/list-follows.use-case';
import {
    RefuseFollowRequestUseCase,
    RefuseFollowRequestUseCaseProvider,
} from 'src/follower/application/ports/in/use-cases/refuse-follow-request.use-case';
import {
    UnfollowUseCase,
    UnfollowUseCaseProvider,
} from 'src/follower/application/ports/in/use-cases/unfollow.use-case';
import { FollowDto } from 'src/follower/application/ports/out/dto/follow.dto';
import { FollowErrorHandler } from './handlers/follow-error.handler';
import { FollowRequestMapper } from './mappers/follow-request.mapper';
import { ListFollowsQueryRequest } from './requests/list-follows-query.request';

@ApiTags('Followers')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('followers')
@UseFilters(new FollowErrorHandler())
export class FollowController extends ApiController {
	public constructor(
		@Inject(FollowUseCaseProvider)
		protected followUseCase: FollowUseCase,
		@Inject(UnfollowUseCaseProvider)
		protected unfollowUseCase: UnfollowUseCase,
		@Inject(AcceptFollowRequestUseCaseProvider)
		protected acceptFollowRequestUseCase: AcceptFollowRequestUseCase,
		@Inject(RefuseFollowRequestUseCaseProvider)
		protected refuseFollowRequestUseCase: RefuseFollowRequestUseCase,
		@Inject(ListFollowsUseCaseProvider)
		protected listFollowsUseCase: ListFollowsUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List follows' })
	@ApiOkResponse({ type: Array<FollowDto> })
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
		@Query() query: ListFollowsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FollowRequestMapper.listFollowsCommand(query);

		const data = await this.listFollowsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Follow user' })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiCreatedResponse({ type: FollowDto })
	@UseGuards(AuthGuard)
	@Post(':from_id/follow/:to_id')
	public async follow(
		@Param('from_id') fromUserId: string,
		@Param('to_id') toUserId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FollowRequestMapper.followCommand(fromUserId, toUserId);

		const data = await this.followUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Unfollow user' })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':from_id/unfollow/:to_id')
	public async unfollow(
		@Param('from_id') fromUserId: string,
		@Param('to_id') toUserId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = FollowRequestMapper.unfollowCommand(
			fromUserId,
			toUserId,
		);

		await this.unfollowUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Accept follow request' })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Put('requests/:follow_request_id/accept')
	public async acceptFollowRequest(
		@Param('follow_request_id') followRequestId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command =
			FollowRequestMapper.acceptFollowRequestCommand(followRequestId);

		await this.acceptFollowRequestUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Refuse follow request' })
	@ApiConflictResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Put('requests/:follow_request_id/refuse')
	public async refuseFollowRequest(
		@Param('follow_request_id') followRequestId: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command =
			FollowRequestMapper.refuseFollowRequestCommand(followRequestId);

		await this.refuseFollowRequestUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
