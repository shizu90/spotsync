import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserUseCase, CreateUserUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user.use-case";
import { DeleteUserUseCase, DeleteUserUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user.use-case";
import { UpdateUserCredentialsUseCase, UpdateUserCredentialsUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-credentials.use-case";
import { UpdateUserProfileUseCase, UpdateUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-profile.use-case";
import { UploadBannerPictureUseCase, UploadBannerPictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-banner-picture.use-case";
import { UploadProfilePictureUseCase, UploadProfilePictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-profile-picture.use-case";
import { CreateUserRequest } from "./requests/create-user.request";
import { UserRequestMapper } from "./mappers/user-request.mapper";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UserErrorHandler } from "./handlers/user-error.handler";
import { GetUserProfileUseCase, GetUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-profile.use-case";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { UpdateUserVisibilityConfigRequest } from "./requests/update-user-visibility-config.request";
import { UpdateUserVisibilityConfigUseCase, UpdateUserVisibilityConfigUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-visibility-config.use-case";
import { ListUsersUseCase, ListUsersUseCaseProvider } from "src/user/application/ports/in/use-cases/list-users.use-case";
import { ListUsersQueryRequest } from "./requests/list-users-query.request";

@ApiTags('Users')
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserController 
{
    constructor(
        @Inject(GetUserProfileUseCaseProvider) 
        protected readonly getUserProfileUseCase: GetUserProfileUseCase,
        @Inject(ListUsersUseCaseProvider)
        protected readonly listUsersUseCase: ListUsersUseCase,
        @Inject(CreateUserUseCaseProvider) 
        protected readonly createUserUseCase: CreateUserUseCase,
        @Inject(UpdateUserProfileUseCaseProvider) 
        protected readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        @Inject(UpdateUserCredentialsUseCaseProvider) 
        protected readonly updateUserCredentialsUseCase: UpdateUserCredentialsUseCase,
        @Inject(UpdateUserVisibilityConfigUseCaseProvider)
        protected readonly updateUserVisibilityConfigUseCase: UpdateUserVisibilityConfigUseCase,
        @Inject(UploadProfilePictureUseCaseProvider) 
        protected readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
        @Inject(UploadBannerPictureUseCaseProvider) 
        protected readonly uploadBannerPictureUseCase: UploadBannerPictureUseCase,
        @Inject(DeleteUserUseCaseProvider) 
        protected readonly deleteUserUseCase: DeleteUserUseCase
    ) 
    {}

    @ApiOperation({summary: 'List and search users'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Get()
    public async list(@Query() query: ListUsersQueryRequest, @Req() req: Request, @Res() res: Response)  
    {
        const command = UserRequestMapper.listUsersCommand(query);
       
        const data = await this.listUsersUseCase.execute(command);

        res
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Get user by id'})
    @UseGuards(AuthGuard)
    @Get(':id/profile')
    public async get(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.getUserProfileCommand(id, undefined);

        const data = await this.getUserProfileUseCase.execute(command);
    
        res
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Create user'})
    @UsePipes(new ValidationPipe({transform: true}))
    @Post()
    public async create(@Body() body: CreateUserRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.createUserCommand(body)
    
        const data = await this.createUserUseCase.execute(command);

        res
            .status(HttpStatus.CREATED)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Update user profile'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id')
    public async updateProfile(@Param('id') id: string, @Body() body: UpdateUserProfileRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.updateUserProfileCommand(id, body);

        this.updateUserProfileUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Update user credentials'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id/credentials')
    public async updateCredentials(@Param('id') id: string, @Body() body: UpdateUserCredentialsRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.updateUserCredentialsCommand(id, body);

        this.updateUserCredentialsUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Update user visibility configurations'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id/visibility-configuration')
    public async udpateVisibilityConfiguration(@Param('id') id: string, @Body() body: UpdateUserVisibilityConfigRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.updateUserVisibilityConfigCommand(id, body);

        this.updateUserVisibilityConfigUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Delete user by id'})
    @UseGuards(AuthGuard)
    @Delete(':id')
    public async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserRequestMapper.deleteUserCommand(id);

        this.deleteUserUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }
}