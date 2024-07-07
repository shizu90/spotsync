import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserUseCase, CreateUserUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user.use-case";
import { DeleteUserUseCase, DeleteUserUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user.use-case";
import { UpdateUserCredentialsUseCase, UpdateUserCredentialsUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-credentials.use-case";
import { UpdateUserProfileUseCase, UpdateUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-profile.use-case";
import { UploadBannerPictureUseCase, UploadBannerPictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-banner-picture.use-case";
import { UploadProfilePictureUseCase, UploadProfilePictureUseCaseProvider } from "src/user/application/ports/in/use-cases/upload-profile-picture.use-case";
import { CreateUserRequest } from "./requests/create-user.request";
import { CreateUserCommand } from "src/user/application/ports/in/commands/create-user.command";
import { UserDtoMapper } from "./user-dto.mapper";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/commands/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/commands/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/commands/delete-user.command";
import { CreateUserAddressUseCase, CreateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user-address.use-case";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { CreateUserAddressCommand } from "src/user/application/ports/in/commands/create-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/commands/update-user-address.command";
import { UpdateUserAddressUseCase, UpdateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-address.use-case";
import { GetUserAddressesCommand } from "src/user/application/ports/in/commands/get-user-addresses.command";
import { DeleteUserAddressUseCase, DeleteUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user-address.use-case";
import { GetUserAddressesUseCase } from "src/user/application/ports/in/use-cases/get-user-addresses.use-case";
import { GetUserAddressCommand } from "src/user/application/ports/in/commands/get-user-address.command";
import { GetUserAddressUseCase, GetUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-address.use-case";
import { UserErrorHandler } from "./handlers/error.handler";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/commands/delete-user-address.command";
import { GetUserProfileUseCase, GetUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-profile.use-case";
import { GetUserProfileCommand } from "src/user/application/ports/in/commands/get-user-profile.command";

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

    @Get(':id/profile')
    public async get(@Param('id') id: string) 
    {
        const command: GetUserProfileCommand = UserDtoMapper.getUserProfileCommand(id);

        const data = await this.getUserProfileUseCase.execute(command);
    
        return {
            'data': data
        };
    }

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    public async create(@Body() request: CreateUserRequest) 
    {
        const command: CreateUserCommand = UserDtoMapper.createUserCommand(request)
    
        const data = await this.createUserUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateProfile(@Param() id: string, @Body() request: UpdateUserProfileRequest) 
    {
        const command: UpdateUserProfileCommand = UserDtoMapper.updateUserProfileCommand(id, request);

        const data = await this.updateUserProfileUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Put(':id/credentials')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateCredentials(@Param() id: string, @Body() request: UpdateUserCredentialsRequest) 
    {
        const command: UpdateUserCredentialsCommand = UserDtoMapper.updateUserCredentialsCommand(id, request);

        const data = await this.updateUserCredentialsUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Delete(':id')
    public async delete(@Param() id: string) 
    {
        const command: DeleteUserCommand = UserDtoMapper.deleteUserCommand(id);

        const data = await this.deleteUserUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Get(':id/address')
    public async getAddresses(@Param() id: string) 
    {
        const command: GetUserAddressesCommand = UserDtoMapper.getUserAddressesCommand(id);

        const data = await this.getUserAddressesUseCase.execute(command)

        return {
            'data': data
        };
    }

    @Get(':id/address/:address_id')
    public async getAddress(@Param() id: string, @Param() address_id: string) 
    {
        const command: GetUserAddressCommand = UserDtoMapper.getUserAddressCommand(address_id, id);

        const data = await this.getUserAddressUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Post(':id/address')
    @UsePipes(new ValidationPipe({transform: true}))
    public async createAddress(@Param() id: string, @Body() request: CreateUserAddressRequest) 
    {
        const command: CreateUserAddressCommand = UserDtoMapper.createUserAddressCommand(id, request);
    
        const data = await this.createUserAddressUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Put(':id/address/:addressId')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateAddress(@Param() id: string, @Param() addressId: string, @Body() request: UpdateUserAddressRequest) 
    {
        const command: UpdateUserAddressCommand = UserDtoMapper.updateUserAddressCommand(addressId, id, request);

        const data = await this.updateUserAddressUseCase.execute(command);

        return {
            'data': data
        };
    }

    @Delete(':id/address/:addressId')
    public async deleteAddress(@Param() id: string, @Param() addressId: string) 
    {
        const command: DeleteUserAddressCommand = UserDtoMapper.deleteUserAddressCommand(addressId, id);

        const data = await this.deleteUserAddressUseCase.execute(command);

        return {
            'data': data
        };
    }
}