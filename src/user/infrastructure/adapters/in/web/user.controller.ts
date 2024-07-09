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
import { CreateUserAddressUseCase, CreateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user-address.use-case";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { CreateUserAddressCommand } from "src/user/application/ports/in/commands/create-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/commands/update-user-address.command";
import { UpdateUserAddressUseCase, UpdateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-address.use-case";
import { GetUserAddressesCommand } from "src/user/application/ports/in/commands/get-user-addresses.command";
import { DeleteUserAddressUseCase, DeleteUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user-address.use-case";
import { GetUserAddressesUseCase, GetUserAddressesUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-addresses.use-case";
import { GetUserAddressCommand } from "src/user/application/ports/in/commands/get-user-address.command";
import { GetUserAddressUseCase, GetUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-address.use-case";
import { UserErrorHandler } from "./handlers/user-error.handler";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/commands/delete-user-address.command";
import { GetUserProfileUseCase, GetUserProfileUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-profile.use-case";
import { GetUserProfileCommand } from "src/user/application/ports/in/commands/get-user-profile.command";
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GetUserProfileDto } from "src/user/application/ports/out/dto/get-user-profile.dto";
import { CreateUserDto } from "src/user/application/ports/out/dto/create-user.dto";
import { GetUserAddressDto } from "src/user/application/ports/out/dto/get-user-address.dto";
import { CreateUserAddressDto } from "src/user/application/ports/out/dto/create-user-address.dto";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";

@ApiTags('Users')
@ApiNotFoundResponse({
    example: {
        timestamp: new Date(),
        path: '',
        message: ''
    }
})
@ApiConflictResponse({
    example: {
        timestamp: new Date(),
        path: '',
        message: ''
    }
})
@ApiUnprocessableEntityResponse({
    example: {
        timestamp: new Date(),
        path: '',
        message: ''
    }
})
@ApiUnauthorizedResponse({
    example: {
        timestamp: new Date(),
        path: '',
        message: ''
    }
})
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
        @Inject(GetUserAddressesUseCaseProvider) 
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

    @ApiOperation({summary: 'Get user by id'})
    @ApiOkResponse({schema: {
        example: {
            data: new GetUserProfileDto(
                '', 
                '', 
                '', 
                new Date(), 
                new Date(), 
                '', 
                '', 
                {name: ''}, 
                {
                    id: '', 
                    name: '', 
                    area: '', 
                    sub_area: '', 
                    locality: '', 
                    latitude: 0.0, 
                    longitude: 0.0, 
                    country_code: '', 
                    created_at: new Date(), 
                    updated_at: new Date()
                }
            )
        }
    }})
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
    @ApiCreatedResponse({
        example: {
            data: new CreateUserDto(
                '',
                '',
                '',
                '',
                new Date(),
                false,
                new Date(),
                new Date(),
                {name: '', email: ''}
            )
        }
    })
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
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
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
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
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

    @ApiOperation({summary: 'Delete user by id'})
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
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

    @ApiOperation({summary: 'Get user addresses'})
    @ApiOkResponse({
        example: {
            data: [
                new GetUserAddressDto(
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    0.0,
                    0.0,
                    true,
                    new Date(), new Date()
                )
            ]
        }
    })
    @UseGuards(AuthGuard)
    @Get(':id/address')
    public async getAddresses(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
    {
        const command: GetUserAddressesCommand = UserRequestMapper.getUserAddressesCommand(id);

        const data = await this.getUserAddressesUseCase.execute(command)

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Get user address'})
    @ApiOkResponse({
        example: {
            data: new GetUserAddressDto(
                '',
                '',
                '',
                '',
                '',
                '',
                0.0, 0.0,
                true,
                new Date(), new Date()
            )
        }
    })
    @UseGuards(AuthGuard)
    @Get(':id/address/:address_id')
    public async getAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command: GetUserAddressCommand = UserRequestMapper.getUserAddressCommand(addressId, id);

        const data = await this.getUserAddressUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Create user address'})
    @ApiCreatedResponse({
        example: {
            data: new CreateUserAddressDto(
                '',
                '',
                '',
                '',
                '',
                '',
                0.0, 0.0,
                true,
                new Date(), new Date()
            )
        }
    })
    @UseGuards(AuthGuard)
    @Post(':id/address')
    @UsePipes(new ValidationPipe({transform: true}))
    public async createAddress(@Param('id') id: string, @Body() request: CreateUserAddressRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: CreateUserAddressCommand = UserRequestMapper.createUserAddressCommand(id, request);
    
        const data = await this.createUserAddressUseCase.execute(command);

        res
            .status(201)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Update user address'})
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
    @UseGuards(AuthGuard)
    @Put(':id/address/:address_id')
    @UsePipes(new ValidationPipe({transform: true}))
    public async updateAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Body() body: UpdateUserAddressRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command: UpdateUserAddressCommand = UserRequestMapper.updateUserAddressCommand(addressId, id, body);

        await this.updateUserAddressUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Delete user address'})
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
    @UseGuards(AuthGuard)
    @Delete(':id/address/:address_id')
    public async deleteAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command: DeleteUserAddressCommand = UserRequestMapper.deleteUserAddressCommand(addressId, id);

        await this.deleteUserAddressUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }
}