import {
	ArgumentsHost,
	BadRequestException,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from 'src/common/web/common.error';

export class AuthErrorHandler implements ExceptionFilter {
	public catch(error: Error | HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		switch (error.constructor.name) {
			case 'UserNotFoundError':
				response
					.status(HttpStatus.NOT_FOUND)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
							error.constructor.name,
						),
					);
				break;
			case 'UnauthorizedAccessError':
				response
					.status(HttpStatus.FORBIDDEN)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
							error.constructor.name,
						),
					);
				break;
			case 'UnauthenticatedError':
				response
					.status(HttpStatus.UNAUTHORIZED)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
							error.constructor.name,
						),
					);
				break;
			case 'UserInvalidCredentialsError':
			case 'ValidationError':
				response
					.status(HttpStatus.UNPROCESSABLE_ENTITY)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
							error.constructor.name,
						),
					);
				break;
			default:
				if (error instanceof BadRequestException) {
					response
						.status(HttpStatus.BAD_REQUEST)
						.json(
							new ErrorResponse(
								request.url,
								new Date().toISOString(),
								error.getResponse()['message'],
								error.constructor.name,
							),
						);
				} else {
					response
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json(
							new ErrorResponse(
								request.url,
								new Date().toISOString(),
								error.message,
								error.constructor.name,
							),
						);
				}
				break;
		}
	}
}
