import {
	ArgumentsHost,
	BadRequestException,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from 'src/common/web/common.error';

export class SpotFolderErrorHandler implements ExceptionFilter {
	public catch(error: Error | HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		switch (error.constructor.name) {
			case 'SpotFolderNotFoundError':
			case 'SpotNotFoundError':
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
			case 'SpotFolderAlreadyAddedError':
			case 'SpotAlreadyAddedError':
				response
					.status(HttpStatus.CONFLICT)
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
			case 'UnauthorizedAccessError':
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
								error.stack,
							),
						);
				}
				break;
		}
	}
}
