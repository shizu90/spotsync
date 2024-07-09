import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserUseCase, CreateUserUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user.use-case";
import { DeleteUserUseCase, DeleteUserUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user.use-case";
import { UpdateUserCredentialsUseCase, UpdateUserCredentialsUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-credentials.use-case";
import { UpdateUserProfileUseCase, UpdateUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-profile.use-case";
import { UploadBannerPictureUseCase, UploadBannerPictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-banner-picture.use-case";
import { UploadProfilePictureUseCase, UploadProfilePictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-profile-picture.use-case";
import { CreateUserRequest } from "./requests/create-user.request";
import { CreateUserCommand } from "src/user/application/ports/in/commands/create-user.command";
import { UserRequestMapper } from "./user-request.mapper";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/commands/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/commands/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/commands/delete-user.command";
import { UserErrorHandler } from "./handlers/user-error.handler";
import { GetUserProfileUseCase, GetUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-profile.use-case";
import { GetUserProfileCommand } from "src/user/application/ports/in/commands/get-user-profile.command";
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { UpdateUserVisibilityConfigCommand } from "src/user/application/ports/in/commands/update-user-visibility-config.command";
import { UpdateUserVisibilityConfigRequest } from "./requests/update-user-visibility-config.request";
import { UpdateUserVisibilityConfigUseCase, UpdateUserVisibilityConfigUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-visibility-config.use-case";

@ApiTags('Users')
@ApiNotFoundResponse({})
@ApiConflictResponse({})
@ApiUnprocessableEntityResponse({})
@ApiUnauthorizedResponse({})
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserController 
{
    constructor(
        @Inject(GetUserProfileUseCaseProvider) 
        protected readonly getUserProfileUseCase: GetUserProfileUseCase,
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

    @ApiOperation({summary: 'Get user by id'})
    @ApiOkResponse({})
    @UseGuards(AuthGuard)
    @Get(':id/profile')
    public async get(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command: GetUserProfileCommand = UserRequestMapper.getUserProfileCommand(id, undefined);

        const data = await this.getUserProfileUseCase.execute(command);
    
        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Create user'})
    @ApiCreatedResponse({})
    @ApiBody({type: [CreateUserRequest]})
    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    public async create(@Body() body: CreateUserRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: CreateUserCommand = UserRequestMapper.createUserCommand(body)
    
        const data = await this.createUserUseCase.execute(command);

        res
            .status(201)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Update user profile'})
    @ApiNoContentResponse({})
    @ApiBody({type: UpdateUserProfileRequest})
    @UseGuards(AuthGuard)
    @Put(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateProfile(@Param('id') id: string, @Body() body: UpdateUserProfileRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: UpdateUserProfileCommand = UserRequestMapper.updateUserProfileCommand(id, body);

        await this.updateUserProfileUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Update user credentials'})
    @ApiNoContentResponse({})
    @ApiBody({type: UpdateUserCredentialsRequest})
    @UseGuards(AuthGuard)
    @Put(':id/credentials')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateCredentials(@Param('id') id: string, @Body() body: UpdateUserCredentialsRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: UpdateUserCredentialsCommand = UserRequestMapper.updateUserCredentialsCommand(id, body);

        await this.updateUserCredentialsUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Update user visibility configurations'})
    @ApiNoContentResponse({})
    @ApiBody({type: UpdateUserVisibilityConfigRequest})
    @UseGuards(AuthGuard)
    @Put(':id/visibility-configuration')
    @UsePipes(new ValidationPipe({transform: true}))
    public async udpateVisibilityConfiguration(@Param('id') id: string, @Body() body: UpdateUserVisibilityConfigRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: UpdateUserVisibilityConfigCommand = UserRequestMapper.updateUserVisibilityConfigCommand(id, body);

        await this.updateUserVisibilityConfigUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Delete user by id'})
    @ApiNoContentResponse({})
    @UseGuards(AuthGuard)
    @Delete(':id')
    public async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command: DeleteUserCommand = UserRequestMapper.deleteUserCommand(id);

        const data = await this.deleteUserUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }
}