import { Controller, Delete, Inject, Param, Post, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FollowUseCase, FollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/follow.use-case";
import { UnfollowUseCase, UnfollowUseCaseProvider } from "src/follower/application/ports/in/use-cases/unfollow.use-case";
import { FollowRequestMapper } from "./follow-request.mapper";
import { FollowDto } from "src/follower/application/ports/out/dto/follow.dto";
import { FollowErrorHandler } from "./handlers/follow-error.handler";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";

@ApiTags('Followers')
@Controller('followers')
@UseFilters(new FollowErrorHandler())
export class FollowController 
{
    public constructor(
        @Inject(FollowUseCaseProvider)
        protected followUseCase: FollowUseCase,
        @Inject(UnfollowUseCaseProvider)
        protected unfollowUseCase: UnfollowUseCase
    ) 
    {}

    @ApiOperation({summary: 'Follow user'})
    @ApiCreatedResponse({
        example: {
            data: new FollowDto('', '', '')
        }
    })
    @Post(':from_id/follow/:to_id')
    @UseGuards(AuthGuard)
    public async follow(@Param('from_id') fromUserId: string, @Param('to_id') toUserId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.followCommand(fromUserId, toUserId);

        const data = await this.followUseCase.execute(command);

        res
            .status(201)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Unfollow user'})
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
    @Delete(':from_id/unfollow/:to_id')
    @UseGuards(AuthGuard)
    public async unfollow(@Param('from_id') fromUserId: string, @Param('to_id') toUserId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = FollowRequestMapper.unfollowCommand(fromUserId, toUserId);

        this.unfollowUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }
}