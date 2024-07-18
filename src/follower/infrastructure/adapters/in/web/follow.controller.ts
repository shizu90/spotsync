import { Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FollowUseCase, FollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/follow.use-case";
import { UnfollowUseCase, UnfollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/unfollow.use-case";
import { FollowRequestMapper } from "./mappers/follow-request.mapper";
import { FollowErrorHandler } from "./handlers/follow-error.handler";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { AcceptFollowRequestUseCase, AcceptFollowRequestUseCaseProvider } from "src/follower/application/ports/in/use-cases/accept-follow-request.use-case";
import { RefuseFollowRequestUseCaseProvider, RefusseFollowRequestUseCase } from "src/follower/application/ports/in/use-cases/refuse-follow-request.use-case";
import { ListFollowsQueryRequest } from "./requests/list-follows-query.request";
import { ListFollowRequestsQueryRequest } from "./requests/list-follow-requests-query.request";
import { ListFollowsUseCase, ListFollowsUseCaseProvider } from "src/follower/application/ports/in/use-cases/list-follows.use-case";
import { ListFollowRequestsUseCase, ListFollowRequestsUseCaseProvider } from "src/follower/application/ports/in/use-cases/list-follow-requests.use-case";

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
        protected refuseFollowRequestUseCase: RefusseFollowRequestUseCase,
        @Inject(ListFollowsUseCaseProvider)
        protected listFollowsUseCase: ListFollowsUseCase,
        @Inject(ListFollowRequestsUseCaseProvider)
        protected listFollowRequestsUseCase: ListFollowRequestsUseCase
    ) 
    {}

    @ApiOperation({summary: 'List follows'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Get()
    public async list(@Query() query: ListFollowsQueryRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.listFollowsCommand(query);

        const data = await this.listFollowsUseCase.execute(command);

        res
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'List follow requests'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Get('requests')
    public async listRequests(@Query() query: ListFollowRequestsQueryRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.listFollowRequestsCommand(query);

        const data = await this.listFollowRequestsUseCase.execute(command);

        res
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }


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