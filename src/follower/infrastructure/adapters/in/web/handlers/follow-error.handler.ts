import {
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class FollowErrorHandler implements ExceptionFilter {
  public catch(error: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    switch (error.constructor.name) {
      case 'UserNotFoundError':
        response.status(HttpStatus.NOT_FOUND).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
        });

        break;
      case 'UnauthorizedAccessError':
        response.status(HttpStatus.UNAUTHORIZED).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
        });

        break;
      case 'AlreadyFollowingError':
        response.status(HttpStatus.CONFLICT).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
        });

        break;
      case 'NotFollowingError':
        response.status(HttpStatus.NOT_FOUND).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
        });

        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
        });

        break;
    }
  }
}
