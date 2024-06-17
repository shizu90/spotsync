import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserUseCase } from "src/user/application/ports/in/create-user.use-case";
import { DeleteUserUseCase } from "src/user/application/ports/in/delete-user.use-case";
import { GetUserCommand } from "src/user/application/ports/in/get-user.command";
import { GetUserUseCase } from "src/user/application/ports/in/get-user.use-case";
import { UpdateUserCredentialsUseCase } from "src/user/application/ports/in/update-user-credentials.use-case";
import { UpdateUserProfileUseCase } from "src/user/application/ports/in/update-user-profile.use-case";
import { UploadBannerPictureUseCase } from "src/user/application/ports/in/upload-banner-picture.use-case";
import { UploadProfilePictureUseCase } from "src/user/application/ports/in/upload-profile-picture.use-case";
import { CreateUserRequest } from "./requests/create-user.request";
import { CreateUserCommand } from "src/user/application/ports/in/create-user.command";
import { UserRequestCommandMapper } from "./user-request-command.mapper";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/delete-user.command";

@Controller('users')
export class UserController 
{
    constructor(
        protected readonly getUserUseCase: GetUserUseCase,
        protected readonly createUserUseCase: CreateUserUseCase,
        protected readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        protected readonly updateUserCredentialsUseCase: UpdateUserCredentialsUseCase,
        protected readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
        protected readonly uploadBannerPictureUseCase: UploadBannerPictureUseCase,
        protected readonly deleteUseUseCase: DeleteUserUseCase
    ) 
    {}

    @Get(':id')
    public get() 
    {
        return {
            'data': this.getUserUseCase.execute(new GetUserCommand(null))
        };
    }

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    public create(@Body() request: CreateUserRequest) 
    {
        const command: CreateUserCommand = UserRequestCommandMapper.createUserCommand(request)
    
        return {
            'data': this.createUserUseCase.execute(command)
        };
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    public updateProfile(@Param() id: string, @Body() request: UpdateUserProfileRequest) 
    {
        const command: UpdateUserProfileCommand = UserRequestCommandMapper.updateUserProfileCommand(id, request);

        return {
            'data': this.updateUserProfileUseCase.execute(command)
        };
    }

    @Put(':id/credentials')
    @UsePipes(new ValidationPipe({transform: true}))
    public updateCredentials(@Param() id: string, @Body() request: UpdateUserCredentialsRequest) 
    {
        const command: UpdateUserCredentialsCommand = UserRequestCommandMapper.updateUserCredentialsCommand(id, request);
        
        return {
            'data': this.updateUserCredentialsUseCase.execute(command)
        };
    }

    @Delete(':id')
    public delete(@Param() id: string) 
    {
        const command: DeleteUserCommand = UserRequestCommandMapper.deleteUserCommand(id);

        return {
            'data': this.deleteUseUseCase.execute(command)
        };
    }
}