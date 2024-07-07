import { ArgumentsHost, BadRequestException, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { timestamp } from "rxjs";

export class UserErrorHandler implements ExceptionFilter 
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
                    status_code: 404,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'UserAlreadyExistsError':
                response.status(422)
                .json({
                    status_code: 422,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'UserAddressNotFoundError':
                response.status(404)
                .json({
                    status_code: 404,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'ValidationError':
                response.status(400)
                .json({
                    status_code: 400,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                })
                break;
            default:
                if(error instanceof BadRequestException) {
                    response.status(400)
                    .json({
                        status_code: 400,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        message: error.getResponse()['message']
                    })
                }else {
                    response.status(500)
                    .json({
                        status_code: 500,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        message: error.message
                    })
                }
                break;
        }
    }
}