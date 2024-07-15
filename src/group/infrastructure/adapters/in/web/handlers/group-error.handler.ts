import { ArgumentsHost, BadRequestException, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

export class GroupErrorHandler implements ExceptionFilter 
{
    public catch(error: Error | HttpException, host: ArgumentsHost) 
    {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>();
        
        switch(error.constructor.name) {
            case 'GroupNotFoundError':
            case 'GroupRoleNotFoundError':
            case 'GroupMemberNotFoundError':
                response.status(HttpStatus.NOT_FOUND)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'UnableToLeaveGroupError':
                response.status(HttpStatus.FORBIDDEN)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
                break;
            case 'AlreadyMemberOfGroupError':
            case 'AlreadyRequestedToJoinError':
                response.status(HttpStatus.CONFLICT)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });

                break;
            case 'UnauthorizedAccessError':
                response.status(HttpStatus.UNAUTHORIZED)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });
            
                break;
            case 'ValidationError':
                response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: error.message
                });

                break;
            default:
                if(error instanceof BadRequestException) {
                    response.status(HttpStatus.BAD_REQUEST)
                    .json({
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        message: error.getResponse()['message']
                    })
                }else {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
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