import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { UserAddressRequestMapper } from "./mappers/user-address-request.mapper";
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { GetUserAddressUseCase, GetUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-address.use-case";
import { GetUserAddressesUseCase, GetUserAddressesUseCaseProvider } from "src/user/application/ports/in/use-cases/get-user-addresses.use-case";
import { CreateUserAddressUseCase, CreateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/create-user-address.use-case";
import { UpdateUserAddressUseCase, UpdateUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/update-user-address.use-case";
import { DeleteUserAddressUseCase, DeleteUserAddressUseCaseProvider } from "src/user/application/ports/in/use-cases/delete-user-address.use-case";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { UserErrorHandler } from "./handlers/user-error.handler";
import { GetUserAddressesQueryRequest } from "./requests/get-user-addresses-query.request";

@ApiTags('User addresses')
@Controller('users')
@UseFilters(new UserErrorHandler())
export class UserAddressController 
{
    constructor(
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
    @UseGuards(AuthGuard)
    @Get(':id/address')
    public async getAddresses(@Param('id') id: string, @Query() query: GetUserAddressesQueryRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserAddressRequestMapper.getUserAddressesCommand(id, query);

        const data = await this.getUserAddressesUseCase.execute(command)

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Get user address'})
    @UseGuards(AuthGuard)
    @Get(':id/address/:address_id')
    public async getAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserAddressRequestMapper.getUserAddressCommand(addressId, id);

        const data = await this.getUserAddressUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Create user address'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Post(':id/address')
    public async createAddress(@Param('id') id: string, @Body() request: CreateUserAddressRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserAddressRequestMapper.createUserAddressCommand(id, request);
    
        const data = await this.createUserAddressUseCase.execute(command);

        res
            .status(201)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Update user address'})
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Put(':id/address/:address_id')
    public async updateAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Body() body: UpdateUserAddressRequest, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserAddressRequestMapper.updateUserAddressCommand(addressId, id, body);

        this.updateUserAddressUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @ApiOperation({summary: 'Delete user address'})
    @UseGuards(AuthGuard)
    @Delete(':id/address/:address_id')
    public async deleteAddress(@Param('id') id: string, @Param('address_id') addressId: string, @Req() req: Request, @Res() res: Response) 
    {
        const command = UserAddressRequestMapper.deleteUserAddressCommand(addressId, id);

        this.deleteUserAddressUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }
}