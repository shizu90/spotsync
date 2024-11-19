import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { CancelSpotEventUseCase, CancelSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/cancel-spot-event.use-case";
import { CreateSpotEventUseCase, CreateSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/create-spot-event.use-case";
import { DeleteSpotEventUseCase, DeleteSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/delete-spot-event.use-case";
import { EndSpotEventUseCase, EndSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/end-spot-event.use-case";
import { GetSpotEventUseCase, GetSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/get-spot-event.use-case";
import { ListSpotEventsUseCase, ListSpotEventsUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/list-spot-events.use-case";
import { ParticipateUseCase, ParticipateUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/participate.command";
import { RemoveParticipationUseCase, RemoveParticipationUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/remove-participation.use-case";
import { StartSpotEventUseCase, StartSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/start-spot-event.use-case";
import { UpdateSpotEventUseCase, UpdateSpotEventUseCaseProvider } from "src/spot-event/application/ports/in/use-cases/update-spot-event.use-case";
import { SpotEventParticipantDto } from "src/spot-event/application/ports/out/dto/spot-event-participant.dto";
import { SpotEventDto } from "src/spot-event/application/ports/out/dto/spot-event.dto";
import { SpotEventErrorHandler } from "./handlers/spot-event-error.handler";
import { SpotEventRequestMapper } from "./mappers/spot-event-request.mapper";
import { CreateSpotEventRequest } from "./requests/create-spot-event.request";
import { ListSpotEventsQueryRequest } from "./requests/list-spot-events-query.request";
import { UpdateSpotEventRequest } from "./requests/update-spot-event.request";

@ApiTags("Spot Events")
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@ApiUnauthorizedResponse({ type: ErrorResponse })
@Controller('spot-events')
@UseFilters(new SpotEventErrorHandler())
export class SpotEventController extends ApiController {
    constructor(
        @Inject(ListSpotEventsUseCaseProvider)
        protected listSpotEventsUseCase: ListSpotEventsUseCase,
        @Inject(GetSpotEventUseCaseProvider)
        protected getSpotEventUseCase: GetSpotEventUseCase,
        @Inject(CreateSpotEventUseCaseProvider)
        protected createSpotEventUseCase: CreateSpotEventUseCase,
        @Inject(UpdateSpotEventUseCaseProvider)
        protected updateSpotEventUseCase: UpdateSpotEventUseCase,
        @Inject(StartSpotEventUseCaseProvider)
        protected startSpotEventUseCase: StartSpotEventUseCase,
        @Inject(EndSpotEventUseCaseProvider)
        protected endSpotEventUseCase: EndSpotEventUseCase,
        @Inject(ParticipateUseCaseProvider)
        protected participateUseCase: ParticipateUseCase,
        @Inject(RemoveParticipationUseCaseProvider)
        protected removeParticipationUseCase: RemoveParticipationUseCase,
        @Inject(CancelSpotEventUseCaseProvider)
        protected cancelSpotEventUseCase: CancelSpotEventUseCase,
        @Inject(DeleteSpotEventUseCaseProvider)
        protected deleteSpotEventUseCase: DeleteSpotEventUseCase,
    ) {super();}

    @ApiOperation({ summary: 'List spot events'})
    @ApiOkResponse({ isArray: true, type: SpotEventDto })
    @UseGuards(AuthGuard)
    @UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
    @Get()
    public async list(
        @Query() query: ListSpotEventsQueryRequest,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.listSpotEventsCommand(query);

        const spotEvents = await this.listSpotEventsUseCase.execute(command);

        res.status(HttpStatus.OK).json({ data: spotEvents });
    }

    @ApiOperation({ summary: 'Get spot event' })
    @ApiOkResponse({ type: SpotEventDto })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
    @Get(':id')
    public async get(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.getSpotEventCommand(id);

        const data = await this.getSpotEventUseCase.execute(command);

        res.status(HttpStatus.OK).json({ data });
    }

    @ApiOperation({ summary: 'Create spot event'})
    @ApiCreatedResponse({ type: SpotEventDto})
    @UseGuards(AuthGuard)
    @UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
    @Post()
    public async create(
        @Body() body: CreateSpotEventRequest,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.createSpotEventCommand(body);

        const data = await this.createSpotEventUseCase.execute(command);

        res.status(HttpStatus.CREATED).json({ data });
    }

    @ApiOperation({ summary: 'Update spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
    @Put(':id')
    public async update(
        @Param('id') id: string,
        @Body() body: UpdateSpotEventRequest,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.updateSpotEventCommand(id, body);

        await this.updateSpotEventUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Start spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Patch(':id/start')
    public async start(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.startSpotEventCommand(id);

        await this.startSpotEventUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'End spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Patch(':id/end')
    public async end(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.endSpotEventCommand(id);

        await this.endSpotEventUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Cancel spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Patch(':id/cancel')
    public async cancel(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.cancelSpotEventCommand(id);

        await this.cancelSpotEventUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Participate in spot event' })
    @ApiOkResponse({ type: SpotEventParticipantDto })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Post(':id/participations')
    public async participate(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.participateCommand(id);

        const data = await this.participateUseCase.execute(command);

        res.status(HttpStatus.OK).json({ data });
    }

    @ApiOperation({ summary: 'Remove participation from spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiConflictResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Delete(':id/participations/:userId')
    public async removeParticipation(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.removeParticipationCommand(id, userId);

        await this.removeParticipationUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Delete spot event' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Delete(':id')
    public async delete(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command = SpotEventRequestMapper.deleteSpotEventCommand(id);

        await this.deleteSpotEventUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

}