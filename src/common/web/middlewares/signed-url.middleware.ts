import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../common.error";
import { URLService } from "../url.service";

@Injectable()
export class SignedUrlMiddleware implements NestMiddleware {
    public use(req: Request, res: Response, next: NextFunction) {
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        const urlService = new URLService();

        const isValid = urlService.verifySignedURL(url);

        if (!isValid) {
            res.status(HttpStatus.FORBIDDEN).json(
                new ErrorResponse(
                    req.originalUrl,
                    new Date().toISOString(),
                    'Invalid signature',
                    'InvalidSignatureError',
                )
            );

            return;
        }
        
        next();
    }
}