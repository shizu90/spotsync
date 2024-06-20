import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserUseCase, CreateUserUseCaseProvider } from "src/user/application/ports/in/create-user.use-case";
import { DeleteUserUseCase, DeleteUserUseCaseProvider } from "src/user/application/ports/in/delete-user.use-case";
import { GetUserCommand } from "src/user/application/ports/in/get-user.command";
import { GetUserUseCase, GetUserUseCaseProvider } from "src/user/application/ports/in/get-user.use-case";
import { UpdateUserCredentialsUseCase, UpdateUserCredentialsUseCaseProvider } from "src/user/application/ports/in/update-user-credentials.use-case";
import { UpdateUserProfileUseCase, UpdateUserProfileUseCaseProvider } from "src/user/application/ports/in/update-user-profile.use-case";
import { UploadBannerPictureUseCase, UploadBannerPictureUseCaseProvider } from "src/user/application/ports/in/upload-banner-picture.use-case";
import { UploadProfilePictureUseCase, UploadProfilePictureUseCaseProvider } from "src/user/application/ports/in/upload-profile-picture.use-case";
import { CreateUserRequest } from "./requests/create-user.request";
import { CreateUserCommand } from "src/user/application/ports/in/create-user.command";
import { UserDtoMapper } from "./user-dto.mapper";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/delete-user.command";
import { CreateUserAddressUseCase, CreateUserAddressUseCaseProvider } from "src/user/application/ports/in/create-user-address.use-case";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { CreateUserAddressCommand } from "src/user/application/ports/in/create-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/update-user-address.command";
import { UpdateUserAddressUseCase, UpdateUserAddressUseCaseProvider } from "src/user/application/ports/in/update-user-address.use-case";
import { GetUserAddressesCommand } from "src/user/application/ports/in/get-user-addresses.command";
import { DeleteUserAddressUseCase, DeleteUserAddressUseCaseProvider } from "src/user/application/ports/in/delete-user-address.use-case";
import { GetUserAddressesUseCase } from "src/user/application/ports/in/get-user-addresses.use-case";
import { GetUserAddressCommand } from "src/user/application/ports/in/get-user-address.command";
import { GetUserAddressUseCase, GetUserAddressUseCaseProvider } from "src/user/application/ports/in/get-user-address.use-case";

@Controller('users')
export class UserController 
{
    constructor(
        @Inject(GetUserUseCaseProvider) 
        protected readonly getUserUseCase: GetUserUseCase,
        @Inject(CreateUserUseCaseProvider) 
        protected readonly createUserUseCase: CreateUserUseCase,
        @Inject(UpdateUserProfileUseCaseProvider) 
        protected readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        @Inject(UpdateUserCredentialsUseCaseProvider) 
        protected readonly updateUserCredentialsUseCase: UpdateUserCredentialsUseCase,
        @Inject(UploadProfilePictureUseCaseProvider) 
        protected readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
        @Inject(UploadBannerPictureUseCaseProvider) 
        protected readonly uploadBannerPictureUseCase: UploadBannerPictureUseCase,
        @Inject(DeleteUserUseCaseProvider) 
        protected readonly deleteUserUseCase: DeleteUserUseCase,
        @Inject(GetUserAddressUseCaseProvider) 
        protected readonly getUserAddressesUseCase: GetUserAddressesUseCase,
        @Inject(GetUserAddressUseCaseProvider) 
        protected readonly getUserAddressUseCase: GetUserAddressUseCase,
        @Inject(CreateUserAddressUseCaseProvider) 
        protected readonly createUserAddressUseCase: CreateUserAddressUseCase,
        @Inject(UpdateUserAddressUseCaseProvider) 
        protected readonly updateUserAddressUseCase: UpdateUserAddressUseCase,
        @Inject(DeleteUserAddressUseCaseProvider) 
        protected readonly deleteUserAddressUseCase: DeleteUserAddressUseCase
    ) 
    {}

    @Get(':id')
    public get(@Param() id: string) 
    {
        const command: GetUserCommand = UserDtoMapper.getUserCommand(id);

        return {
            'data': this.getUserUseCase.execute(command)
        };
    }

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    public create(@Body() request: CreateUserRequest) 
    {
        const command: CreateUserCommand = UserDtoMapper.createUserCommand(request)
    
        return {
            'data': this.createUserUseCase.execute(command)
        };
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    public updateProfile(@Param() id: string, @Body() request: UpdateUserProfileRequest) 
    {
        const command: UpdateUserProfileCommand = UserDtoMapper.updateUserProfileCommand(id, request);

        return {
            'data': this.updateUserProfileUseCase.execute(command)
        };
    }

    @Put(':id/credentials')
    @UsePipes(new ValidationPipe({transform: true}))
    public updateCredentials(@Param() id: string, @Body() request: UpdateUserCredentialsRequest) 
    {
        const command: UpdateUserCredentialsCommand = UserDtoMapper.updateUserCredentialsCommand(id, request);
        
        return {
            'data': this.updateUserCredentialsUseCase.execute(command)
        };
    }

    @Delete(':id')
    public delete(@Param() id: string) 
    {
        const command: DeleteUserCommand = UserDtoMapper.deleteUserCommand(id);

        return {
            'data': this.deleteUserUseCase.execute(command)
        };
    }

    @Get(':id/address')
    public getAddresses(@Param() id: string) 
    {
        const command: GetUserAddressesCommand = UserDtoMapper.getUserAddressesCommand(id);

        return {
            'data': this.getUserAddressesUseCase.execute(command)
        };
    }

    @Get(':id/address/:address_id')
    public getAddress(@Param() id: string, @Param() address_id: string) 
    {
        const command: GetUserAddressCommand = UserDtoMapper.getUserAddressCommand(address_id, id);

        return {
            'data': this.getUserAddressUseCase.execute(command)
        };
    }

    @Post(':id/address')
    @UsePipes(new ValidationPipe({transform: true}))
    public createAddress(@Param() id: string, @Body() request: CreateUserAddressRequest) 
    {
        const command: CreateUserAddressCommand = UserDtoMapper.createUserAddressCommand(id, request);
    
        return {
            'data': this.createUserAddressUseCase.execute(command)
        };
    }

    @Put(':id/address/:addressId')
    @UsePipes(new ValidationPipe({transform: true}))
    public updateAddress(@Param() id: string, @Param() addressId: string, @Body() request: UpdateUserAddressRequest) 
    {
        const command: UpdateUserAddressCommand = UserDtoMapper.updateUserAddressCommand(addressId, id, request);

        return {
            'data': this.updateUserAddressUseCase.execute(command)
        };
    }

    @Delete(':id/address/:addressId')
    public deleteAddress(@Param() id: string, @Param() addressId: string) 
    {
        const command: DeleteUserCommand = UserDtoMapper.deleteUserAddressCommand(addressId, id);

        return {
            'data': this.deleteUserUseCase.execute(command)
        };
    }
}