import { ArgumentsHost, BadRequestException, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

export class AuthErrorHandler implements ExceptionFilter 
{
    public catch(error: Error | HttpException, host: ArgumentsHost) 
    {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>();
        
        switch(error.constructor.name) {
            case 'UserNotFoundError':
                response.status(404)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'UnauthorizedAccessError':
                response.status(401)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'UserInvalidCredentialsError':
            case 'ValidationError':
                response.status(422)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                })
                break;
            default:
                if(error instanceof BadRequestException) {
                    response.status(400)
                    .json({
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        message: error.getResponse()['message']
                    })
                }else {
                    response.status(500)
                    .json({
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        message: error.message
                    })
                }
                break;
        }
    }
}