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
import { Pagination } from 'src/common/core/common.repository';
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
import { GetFollowDto } from 'src/follower/application/ports/out/dto/get-follow.dto';
import { FollowErrorHandler } from './handlers/follow-error.handler';
import { FollowRequestMapper } from './mappers/follow-request.mapper';
import { ListFollowsQueryRequest } from './requests/list-follows-query.request';

@ApiTags('Followers')
@ApiUnauthorizedResponse({
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
	@ApiOkResponse({
		example: {
			data: new Pagination(
				[
					new GetFollowDto(
						'uuid',
						'req',
						{
							id: 'uuid',
							banner_picture: 'string',
							birth_date: new Date(),
							credentials: { name: 'string' },
							display_name: 'string',
							profile_picture: 'string',
							theme_color: '#000000',
						},
						{
							id: 'uuid',
							banner_picture: 'string',
							birth_date: new Date(),
							credentials: { name: 'string' },
							display_name: 'string',
							profile_picture: 'string',
							theme_color: '#000000',
						},
						new Date(),
						new Date(),
					),
				],
				1,
				0,
				10,
			),
		},
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
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
	@ApiConflictResponse({
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
			data: new FollowDto('uuid', 'uuid', 'uuid', 'req', new Date(), new Date()),
		},
	})
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
	@ApiConflictResponse({
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

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Accept follow request' })
	@ApiConflictResponse({
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

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}

	@ApiOperation({ summary: 'Refuse follow request' })
	@ApiConflictResponse({
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

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
