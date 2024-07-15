import { Controller, Delete, HttpStatus, Inject, Param, Post, Put, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FollowUseCase, FollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/follow.use-case";
import { UnfollowUseCase, UnfollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/unfollow.use-case";
import { FollowRequestMapper } from "./mappers/follow-request.mapper";
import { FollowErrorHandler } from "./handlers/follow-error.handler";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { AcceptFollowRequestUseCase, AcceptFollowRequestUseCaseProvider } from "src/follower/application/ports/in/use-cases/accept-follow-request.use-case";
import { RefuseFollowRequestUseCaseProvider, RefusseFollowRequestUseCase } from "src/follower/application/ports/in/use-cases/refuse-follow-request.use-case";

@ApiTags('Followers')
@Controller('followers')
@UseFilters(new FollowErrorHandler())
export class FollowController 
{
    public constructor(
        @Inject(FollowUseCaseProvider)
        protected followUseCase: FollowUseCase,
        @Inject(UnfollowUseCaseProvider)
        protected unfollowUseCase: UnfollowUseCase,
        @Inject(AcceptFollowRequestUseCaseProvider)
        protected acceptFollowRequestUseCase: AcceptFollowRequestUseCase,
        @Inject(RefuseFollowRequestUseCaseProvider)
        protected refuseFollowRequestUseCase: RefusseFollowRequestUseCase
    ) 
    {}

    @ApiOperation({summary: 'Follow user'})
    @UseGuards(AuthGuard)
    @Post(':from_id/follow/:to_id')
    public async follow(@Param('from_id') fromUserId: string, @Param('to_id') toUserId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.followCommand(fromUserId, toUserId);

        const data = await this.followUseCase.execute(command);

        res
            .status(HttpStatus.CREATED)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Unfollow user'})
    @UseGuards(AuthGuard)
    @Delete(':from_id/unfollow/:to_id')
    public async unfollow(@Param('from_id') fromUserId: string, @Param('to_id') toUserId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.unfollowCommand(fromUserId, toUserId);

        await this.unfollowUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Accept follow request'})
    @UseGuards(AuthGuard)
    @Put('requests/:follow_request_id/accept')
    public async acceptFollowRequest(@Param('follow_request_id') followRequestId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.acceptFollowRequestCommand(followRequestId);

        await this.acceptFollowRequestUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Refuse follow request'})
    @UseGuards(AuthGuard)
    @Put('requests/:follow_request_id/refuse')
    public async refuseFollowRequest(@Param('follow_request_id') followRequestId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.refuseFollowRequestCommand(followRequestId);

        await this.refuseFollowRequestUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }
}