import {
	Body,
	Controller,
	HttpStatus,
	Inject,
	Post,
	Res,
	UseFilters,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	SignInUseCase,
	SignInUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/sign-in.use-case';
import { SignInDto } from 'src/auth/application/ports/out/dto/sign-in.dto';
import { ApiController } from 'src/common/web/common.controller';
import { AuthRequestMapper } from './auth-request.mapper';
import { AuthErrorHandler } from './handlers/auth-error.handler';
import { SignInRequest } from './requests/sign-in.request';

@ApiTags('Auth')
@UseFilters(new AuthErrorHandler())
@Controller('auth')
export class AuthController extends ApiController {
	public constructor(
		@Inject(SignInUseCaseProvider)
		protected signInUseCase: SignInUseCase,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'Login' })
	@ApiOkResponse({ type: SignInDto })
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post('login')
	public async login(@Body() request: SignInRequest, @Res() res: Response) {
		const command = AuthRequestMapper.signInCommand(request);

		const data = await this.signInUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}
}
