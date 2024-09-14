import {
    Body,
    Controller,
    HttpStatus,
    Inject,
    Post,
    Put,
    Req,
    Res,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
    GetAuthenticatedUserUseCase,
    GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
    SignInUseCase,
    SignInUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/sign-in.use-case';
import {
    SignOutUseCase,
    SignOutUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/sign-out.use-case';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import { AuthRequestMapper } from './auth-request.mapper';
import { AuthErrorHandler } from './handlers/auth-error.handler';
import { AuthGuard } from './handlers/auth.guard';
import { SignInRequest } from './requests/sign-in.request';

@ApiTags('Auth')
@UseFilters(new AuthErrorHandler())
@Controller('auth')
export class AuthController extends ApiController {
	public constructor(
		@Inject(SignInUseCaseProvider)
		protected signInUseCase: SignInUseCase,
		@Inject(SignOutUseCaseProvider)
		protected signOutUseCase: SignOutUseCase,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'Login' })
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: {enableImplicitConversion: true}, forbidNonWhitelisted: true }))
	@Post('login')
	public async login(@Body() request: SignInRequest, @Res() res: Response) {
		const command = AuthRequestMapper.signInCommand(request);

		const data = await this.signInUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Logout' })
	@ApiForbiddenResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@ApiUnauthorizedResponse({
		example: new ErrorResponse(
			'string',
			'2024-07-24 12:00:00',
			'string',
			'string',
		),
	})
	@UseGuards(AuthGuard)
	@Put('logout')
	public async logout(@Req() req: Request, @Res() res: Response) {
		const authenticatedUserId = req['authenticated_user'];

		const command = AuthRequestMapper.signOutCommand(authenticatedUserId);

		await this.signOutUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json({
			data: {},
		});
	}
}
