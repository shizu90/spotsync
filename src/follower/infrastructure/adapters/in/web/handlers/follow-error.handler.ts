import {
	ArgumentsHost,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from 'src/common/web/common-error.response';

export class FollowErrorHandler implements ExceptionFilter {
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
							error.message
						)
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
						),
					);

				break;
			case 'AlreadyRequestedFollowError':
			case 'AlreadyFollowingError':
				response
					.status(HttpStatus.CONFLICT)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
						),
					);

				break;
			case 'NotFollowingError':
				response
					.status(HttpStatus.NOT_FOUND)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
						),
					);

				break;
			default:
				response
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json(
						new ErrorResponse(
							request.url,
							new Date().toISOString(),
							error.message,
						),
					);

				break;
		}
	}
}
