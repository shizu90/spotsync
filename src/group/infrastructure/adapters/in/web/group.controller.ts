import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
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
import { GroupErrorHandler } from "./handlers/group-error.handler";
import { ListGroupsQueryRequest } from "./requests/list-groups-query.request";

@ApiTags('Groups')
@UseFilters(new GroupErrorHandler())
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
    @UsePipes(new ValidationPipe({transform: true}))
    @Get()
    public async list(@Query() query: ListGroupsQueryRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.listGroupsCommand(query);

        const data = await this.listGroupsUseCase.execute(command);

        res
            .status(HttpStatus.OK)
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
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: "Create group"})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Post()
    public async create(@Body() request: CreateGroupRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.createGroupCommand(request);

        const data = await this.createGroupUseCase.execute(command);

        res
            .status(HttpStatus.CREATED)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: "Update group"})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id')
    public async update(@Param('id') id: string, @Body() request: UpdateGroupRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.updateGroupCommand(id, request);

        await this.updateGroupUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: "Update group visibility"})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id/visibility')
    public async updateVisibility(@Param('id') id: string, @Body() request: UpdateGroupVisibilityRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = GroupRequestMapper.updateGroupVisibilityCommand(id, request);

        await this.updateGroupVisibilityUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
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

        await this.deleteGroupUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }    
}