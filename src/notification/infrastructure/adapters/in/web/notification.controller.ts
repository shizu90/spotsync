import { Controller, Get, HttpStatus, Inject, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { LikeDto } from "src/like/application/ports/out/dto/like.dto";
import { ListNotificationsUseCase, ListNotificationsUseCaseProvider } from "src/notification/application/ports/in/use-cases/list-notifications.use-case";
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
    ) {super();}


    @ApiOperation({ summary: "List notifications" })
    @ApiOkResponse({ isArray: true, type: LikeDto })
    @Get()
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
}