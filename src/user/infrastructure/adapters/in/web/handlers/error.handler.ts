import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";

export class UserErrorHandler implements ExceptionFilter 
{
    public catch(error: Error, host: ArgumentsHost) 
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
            default:

                break;
        }
    }
}