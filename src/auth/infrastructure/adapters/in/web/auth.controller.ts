import { Body, Controller, Get, HttpStatus, Inject, Post, Put, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SignInUseCase, SignInUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-in.use-case";
import { SignOutUseCase, SignOutUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-out.use-case";
import { SignInRequest } from "./requests/sign-in.request";
import { AuthRequestMapper } from "./auth-request.mapper";
import { AuthErrorHandler } from "./handlers/auth-error.handler";
import { AuthGuard } from "./handlers/auth.guard";
import { Request, Response } from "express";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";

@ApiTags('Auth')
@UseFilters(new AuthErrorHandler())
@Controller('auth')
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
    @UsePipes(new ValidationPipe({transform: true}))
    @Post('login')
    public async login(@Body() request: SignInRequest, @Res() res: Response) 
    {
        const command = AuthRequestMapper.signInCommand(request);

        const data = await this.signInUseCase.execute(command);

        res
            .status(HttpStatus.OK)
            .json({
                data: data
            });
    }

    @ApiOperation({summary: 'Logout'})
    @UseGuards(AuthGuard)
    @Put('logout')
    public async logout(@Req() req: Request, @Res() res: Response) 
    {
        const authenticatedUserId = req['authenticated_user'];

        const command = AuthRequestMapper.signOutCommand(authenticatedUserId);

        await this.signOutUseCase.execute(command);

        res
            .status(HttpStatus.NO_CONTENT)
            .json({
                data: {}
            });
    }
}