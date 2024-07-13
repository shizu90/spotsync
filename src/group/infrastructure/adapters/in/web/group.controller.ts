import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { CreateGroupUseCase, CreateGroupUseCaseProvider } from "src/group/application/ports/in/use-cases/create-group.use-case";
import { DeleteGroupUseCase, DeleteGroupUseCaseProvider } from "src/group/application/ports/in/use-cases/delete-group.use-case";
import { ListGroupsUseCase, ListGroupsUseCaseProvider } from "src/group/application/ports/in/use-cases/list-groups.use-case";
import { UpdateGroupVisibilityUseCase, UpdateGroupVisibilityUseCaseProvider } from "src/group/application/ports/in/use-cases/update-group-visibility.use-case";
import { UpdateGroupUseCase, UpdateGroupUseCaseProvider } from "src/group/application/ports/in/use-cases/update-group.use-case";
import { GroupRequestMapper } from "./mappers/group-request.mapper";
import { Request, Response } from "express";
import { GetGroupUseCase, GetGroupUseCaseProvider } from "src/group/application/ports/in/use-cases/get-group.use-case";
import { CreateGroupRequest } from "./requests/create-group.request";
import { UpdateGroupRequest } from "./requests/update-group.request";
import { UpdateGroupVisibilityRequest } from "./requests/update-group-visibility.request";

@ApiTags('Groups')
@Controller('groups')
export class GroupController 
{
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
        protected getGroupUseCase: GetGroupUseCase
    ) 
    {}

    @ApiOperation({summary: "List groups"})
    @UseGuards(AuthGuard)
    @Get()
    public async list(@Query() query: {name?: string, group_visibility?: string, sort?: string, sort_direction?: string, page?: number, paginate?: boolean, limit?: number}, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.listGroupsCommand(query);

        const data = await this.listGroupsUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: "Find group by id"})
    @UseGuards(AuthGuard)
    @Get(':id')
    public async getById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.getGroupCommand(id);

        const data = await this.getGroupUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: "Create group"})
    @UseGuards(AuthGuard)
    @Post()
    public async create(@Body() request: CreateGroupRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.createGroupCommand(request);

        const data = await this.createGroupUseCase.execute(command);

        res
            .status(201)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: "Update group"})
    @UseGuards(AuthGuard)
    @Put(':id')
    public async update(@Param('id') id: string, @Body() request: UpdateGroupRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.updateGroupCommand(id, request);

        this.updateGroupUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: "Update group visibility"})
    @UseGuards(AuthGuard)
    @Put(':id/visibility')
    public async updateVisibility(@Param('id') id: string, @Body() request: UpdateGroupVisibilityRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.updateGroupVisibilityCommand(id, request);

        this.updateGroupVisibilityUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: "Delete group"})
    @UseGuards(AuthGuard)
    @Delete(':id')
    public async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.deleteGroupCommand(id);

        this.deleteGroupUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }    
}