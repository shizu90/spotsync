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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	ChangePasswordUseCase,
	ChangePasswordUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/change-password.use-case';
import {
	ForgotPasswordUseCase,
	ForgotPasswordUseCaseProvider,
} from 'src/user/application/ports/in/use-cases/forgot-password.use-case';
import { PasswordRecoveryDto } from 'src/user/application/ports/out/dto/password-recovery.dto';
import { UserErrorHandler } from './handlers/user-error.handler';
import { UserRequestMapper } from './mappers/user-request.mapper';
import { ChangePasswordRequest } from './requests/change-password.request';
import { ForgotPasswordRequest } from './requests/forgot-password.request';

@ApiTags('Password recovery')
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@Controller('password-recovery')
@UseFilters(new UserErrorHandler())
export class PasswordRecoveryController extends ApiController {
	constructor(
		@Inject(ForgotPasswordUseCaseProvider)
		protected forgotPasswordUseCase: ForgotPasswordUseCase,
		@Inject(ChangePasswordUseCaseProvider)
		protected changePasswordUseCase: ChangePasswordUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'Forgot password' })
	@ApiCreatedResponse({ type: PasswordRecoveryDto })
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Post()
	public async forgotPassword(
		@Body() body: ForgotPasswordRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.forgotPasswordCommand(body);

		const data = await this.forgotPasswordUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Change password' })
	@ApiNoContentResponse()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put('change-password')
	public async changePassword(
		@Body() body: ChangePasswordRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = UserRequestMapper.changePasswordCommand(body);

		await this.changePasswordUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}
}
