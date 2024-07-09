import { Body, Controller, Get, Inject, Post, Put, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { SignInUseCase, SignInUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-in.use-case";
import { SignOutUseCase, SignOutUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-out.use-case";
import { SignInRequest } from "./requests/sign-in.request";
import { AuthRequestMapper } from "./auth-request.mapper";
import { SignInDto } from "src/auth/application/ports/out/dto/sign-in.dto";
import { AuthErrorHandler } from "./handlers/auth-error.handler";
import { AuthGuard } from "./handlers/auth.guard";
import { Request, Response } from "express";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";

@ApiTags('Auth')
@ApiNotFoundResponse({
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
@Controller('auth')
@UseFilters(new AuthErrorHandler())
export class AuthController 
{
    public constructor(
        @Inject(SignInUseCaseProvider)
        protected signInUseCase: SignInUseCase,
        @Inject(SignOutUseCaseProvider)
        protected signOutUseCase: SignOutUseCase,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase
    ) 
    {}

    @ApiOperation({summary: 'Login'})
    @ApiOkResponse({
        example: {
            data: new SignInDto(
                '', '', '', ''
            )
        }
    })
    @ApiBody({type: SignInRequest})
    @Post('login')
    @UsePipes(new ValidationPipe({transform: true}))
    public async login(@Body() request: SignInRequest, @Res() res: Response) 
    {
        const command = AuthRequestMapper.signInCommand(request);

        const data = await this.signInUseCase.execute(command);

        res
            .status(200)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Logout'})
    @ApiNoContentResponse({
        example: {
            data: {}
        }
    })
    @Put('logout')
    @UseGuards(AuthGuard)
    public async logout(@Req() req: Request, @Res() res: Response) 
    {
        const authenticatedUserId = req['authenticated_user'];

        const command = AuthRequestMapper.signOutCommand(authenticatedUserId);

        await this.signOutUseCase.execute(command);

        res
            .status(204)
            .json({
                data: {}
            });
    }

    @Get()
    @UseGuards(AuthGuard)
    public async getAuthenticated() 
    {
        return this.getAuthenticatedUserUseCase.execute(null);
    }
}