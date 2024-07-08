import { Body, Controller, Inject, Post, Put, Res, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { SignInUseCase, SignInUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-in.use-case";
import { SignOutUseCase, SignOutUseCaseProvider } from "src/auth/application/ports/in/use-cases/sign-out.use-case";
import { SignInRequest } from "./requests/sign-in.request";
import { Request, Response } from "express";
import { AuthRequestMapper } from "./auth-request.mapper";
import { SignInDto } from "src/auth/application/ports/out/dto/sign-in.dto";
import { AuthErrorHandler } from "./handlers/auth-error.handler";

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
        protected signOutUseCase: SignOutUseCase
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
    public async logout(@Res() req: Request, @Res() res: Response) 
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
}