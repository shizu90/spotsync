import { Controller, Get, HttpStatus, Inject, Param, Patch, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { LikeDto } from "src/like/application/ports/out/dto/like.dto";
import { ListNotificationsUseCase, ListNotificationsUseCaseProvider } from "src/notification/application/ports/in/use-cases/list-notifications.use-case";
import { ReadAllNotificationsUseCase, ReadAllNotificationsUseCaseProvider } from "src/notification/application/ports/in/use-cases/read-all-notifications.use-case";
import { ReadNotificationUseCase, ReadNotificationUseCaseProvider } from "src/notification/application/ports/in/use-cases/read-notification.use-case";
import { NotificationErrorHandler } from "./handlers/notification-error.handler";
import { NotificationRequestMapper } from "./mappers/notification-request.mapper";
import { ListNotificationsQueryRequest } from "./requests/list-notifications-query.request";

@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@ApiTags("Notifications")
@Controller("notifications")
@UseFilters(new NotificationErrorHandler())
export class NotificationController extends ApiController {
    constructor(
        @Inject(ListNotificationsUseCaseProvider)
        protected listNotificationsUseCase: ListNotificationsUseCase,
        @Inject(ReadNotificationUseCaseProvider)
        protected readNotificationUseCase: ReadNotificationUseCase,
        @Inject(ReadAllNotificationsUseCaseProvider)
        protected readAllNotificationsUseCase: ReadAllNotificationsUseCase,
    ) {super();}


    @ApiOperation({ summary: "List notifications" })
    @ApiOkResponse({ isArray: true, type: LikeDto })
    @Get()
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            forbidNonWhitelisted: true,
        }),
    )
    @UseGuards(AuthGuard)
    public async list(
        @Query() query: ListNotificationsQueryRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = NotificationRequestMapper.listNotificationsCommand(query);

        res.status(HttpStatus.OK).json({
            data: await this.listNotificationsUseCase.execute(command)
        });
    }

    @ApiOperation({ summary: 'Read notification' })
    @ApiNoContentResponse()
    @Patch(':id/read')
    @UseGuards(AuthGuard)
    public async read(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = NotificationRequestMapper.readNotificationCommand(id);

        await this.readNotificationUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Read all notifications' })
    @ApiNoContentResponse()
    @Patch('read-all')
    @UseGuards(AuthGuard)
    public async readAll(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = NotificationRequestMapper.readAllNotificationsCommand();

        await this.readAllNotificationsUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }
}