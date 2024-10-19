import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { CreateRatingUseCase, CreateRatingUseCaseProvider } from "src/rating/application/ports/in/use-cases/create-rating.use-case";
import { DeleteRatingUseCase, DeleteRatingUseCaseProvider } from "src/rating/application/ports/in/use-cases/delete-rating.use-case";
import { GetRatingUseCase, GetRatingUseCaseProvider } from "src/rating/application/ports/in/use-cases/get-rating.use-case";
import { ListRatingsUseCase, ListRatingsUseCaseProvider } from "src/rating/application/ports/in/use-cases/list-ratings.use-case";
import { UpdateRatingUseCase, UpdateRatingUseCaseProvider } from "src/rating/application/ports/in/use-cases/update-rating.use-case";
import { RatingDto } from "src/rating/application/ports/out/dto/rating.dto";
import { RatingErrorHandler } from "./handlers/rating-error.handler";
import { RatingRequestMapper } from "./mappers/rating-request.mapper";
import { CreateRatingRequest } from "./requests/create-rating.request";
import { ListRatingsQueryRequest } from "./requests/list-ratings-query.request";

@ApiTags('Ratings')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@Controller('ratings')
@UseFilters(new RatingErrorHandler())
export class RatingController extends ApiController {
    constructor(
        @Inject(ListRatingsUseCaseProvider)
        protected listRatingsUseCase: ListRatingsUseCase,
        @Inject(GetRatingUseCaseProvider)
        protected getRatingUseCase: GetRatingUseCase,
        @Inject(CreateRatingUseCaseProvider)
        protected createRatingUseCase: CreateRatingUseCase,
        @Inject(UpdateRatingUseCaseProvider)
        protected updateRatingUseCase: UpdateRatingUseCase,
        @Inject(DeleteRatingUseCaseProvider)
        protected deleteRatingUseCase: DeleteRatingUseCase,
    ) {super();}

    @ApiOperation({ summary: 'List ratings' })
    @ApiOkResponse({ type: RatingDto, isArray: true })
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
        @Query() query: ListRatingsQueryRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = RatingRequestMapper.listRatingsCommand(query);

        const data = await this.listRatingsUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Get rating' })
    @ApiOkResponse({ type: RatingDto })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Get(':id')
    public async get(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = RatingRequestMapper.getRatingCommand(id);

        const data = await this.getRatingUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Create rating' })
    @ApiCreatedResponse({ type: RatingDto })
    @ApiConflictResponse({ type: ErrorResponse })
    @ApiNotFoundResponse({ type: ErrorResponse })
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
        @Body() body: CreateRatingRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = RatingRequestMapper.createRatingCommand(body);

        const data = await this.createRatingUseCase.execute(command);

        res.status(HttpStatus.CREATED).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Update rating' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
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
        @Body() body: CreateRatingRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = RatingRequestMapper.updateRatingCommand(id, body);

        await this.updateRatingUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }

    @ApiOperation({ summary: 'Delete rating' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({ type: ErrorResponse })
    @UseGuards(AuthGuard)
    @Put(':id')
    public async delete(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = RatingRequestMapper.DeleteRatingCommand(id);

        await this.deleteRatingUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json();
    }
}
