import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { GetUserAddressesCommand } from "src/user/application/ports/in/commands/get-user-addresses.command";
import { UserRequestMapper } from "./user-request.mapper";
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { GetUserAddressUseCase, GetUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-address.use-case";
import { GetUserAddressesUseCase, GetUserAddressesUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-addresses.use-case";
import { CreateUserAddressUseCase, CreateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user-address.use-case";
import { UpdateUserAddressUseCase, UpdateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-address.use-case";
import { DeleteUserAddressUseCase, DeleteUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user-address.use-case";
import { GetUserAddressCommand } from "src/user/application/ports/in/commands/get-user-address.command";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { CreateUserAddressCommand } from "src/user/application/ports/in/commands/create-user-address.command";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/commands/update-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/commands/delete-user-address.command";
import { UserErrorHandler } from "./handlers/user-error.handler";

@ApiTags('User addresses')
@ApiNotFoundResponse({})
@ApiConflictResponse({})
@ApiUnprocessableEntityResponse({})
@ApiUnauthorizedResponse({})
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserAddressController 
{
    public constructor(
        @Inject(GetUserAddressUseCaseProvider)
        protected getUserAddressUseCase: GetUserAddressUseCase,
        @Inject(GetUserAddressesUseCaseProvider)
        protected getUserAddressesUseCase: GetUserAddressesUseCase,
        @Inject(CreateUserAddressUseCaseProvider)
        protected createUserAddressUseCase: CreateUserAddressUseCase,
        @Inject(UpdateUserAddressUseCaseProvider)
        protected updateUserAddressUseCase: UpdateUserAddressUseCase,
        @Inject(DeleteUserAddressUseCaseProvider)
        protected deleteUserAddressUseCase: DeleteUserAddressUseCase
    ) 
    {}

    @ApiOperation({summary: 'Get user addresses'})
    @ApiOkResponse({})
    @Get(':id/address')
    @UseGuards(AuthGuard)
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
    @ApiOkResponse({})
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
    @ApiCreatedResponse({})
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
    @ApiNoContentResponse({})
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
    @ApiNoContentResponse({})
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