import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { Pagination } from "src/common/core/common.repository";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";
import { AddSpotUseCase, AddSpotUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/add-spot.use-case";
import { CreateSpotFolderUseCase, CreateSpotFolderUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/create-spot-folder.use-case";
import { DeleteSpotFolderUseCase, DeleteSpotFolderUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/delete-spot-folder.use-case";
import { GetSpotFolderUseCase, GetSpotFolderUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/get-spot-folder.use-case";
import { ListSpotFoldersUseCase, ListSpotFoldersUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/list-spot-folders.use-case";
import { RemoveSpotUseCase, RemoveSpotUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/remove-spot.use-case";
import { SortItemsUseCase, SortItemsUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/sort-items.use-case";
import { UpdateSpotFolderUseCase, UpdateSpotFolderUseCaseProvider } from "src/spot-folder/application/ports/in/use-cases/update-spot-folder.use-case";
import { CreateSpotFolderDto } from "src/spot-folder/application/ports/out/dto/create-spot-folder.dto";
import { GetSpotFolderDto } from "src/spot-folder/application/ports/out/dto/get-spot-folder.dto";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { SpotFolderErrorHandler } from "./handlers/spot-folder-error.handler";
import { SpotFolderRequestMapper } from "./mappers/spot-folder-request.mapper";
import { AddSpotRequest } from "./requests/add-spot.request";
import { CreateSpotFolderRequest } from "./requests/create-spot-folder.request";
import { ListSpotFoldersQueryRequest } from "./requests/list-spot-folders-query.request";
import { RemoveSpotRequest } from "./requests/remove-spot.request";
import { SortItemsRequest } from "./requests/sort-items.request";
import { UpdateSpotFolderRequest } from "./requests/update-spot-folder.request";

@ApiTags('Spot folders')
@ApiUnauthorizedResponse({
    example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@ApiForbiddenResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@Controller('spot-folder')
@UseFilters(new SpotFolderErrorHandler())
export class SpotFolderController extends ApiController {
    constructor(
        @Inject(GetSpotFolderUseCaseProvider)
        protected getSpotFolderUseCase: GetSpotFolderUseCase,
        @Inject(ListSpotFoldersUseCaseProvider)
        protected listSpotFoldersUseCase: ListSpotFoldersUseCase,
        @Inject(CreateSpotFolderUseCaseProvider)
        protected createSpotFolderUseCase: CreateSpotFolderUseCase,
        @Inject(UpdateSpotFolderUseCaseProvider)
        protected updateSpotFolderUseCase: UpdateSpotFolderUseCase,
        @Inject(SortItemsUseCaseProvider)
        protected sortItemsUseCase: SortItemsUseCase,
        @Inject(DeleteSpotFolderUseCaseProvider)
        protected deleteSpotFolderUseCase: DeleteSpotFolderUseCase,
        @Inject(AddSpotUseCaseProvider)
        protected addSpotUseCase: AddSpotUseCase,
        @Inject(RemoveSpotUseCaseProvider)
        protected removeSpotUseCase: RemoveSpotUseCase,
    ) {super();}

    @ApiOperation({ summary: 'List spot folders' })
    @ApiOkResponse({
        example: {
            data: new Pagination([
                new GetSpotFolderDto(
                    'uuid',
                    'string',
                    'string',
                    '#000000',
                    SpotFolderVisibility.PUBLIC,
                    [
                        {
                            spot: {
                                id: 'uuid',
                                name: 'string',
                                description: 'string',
                                photos: [
                                    {
                                        id: 'uuid',
                                        file_path: 'string',
                                    }
                                ],
                                type: 'string',
                                address: {
                                    area: 'string',
                                    sub_area: 'string',
                                    country_code: 'BR',
                                    latitude: 0,
                                    locality: 'string',
                                    longitude: 0
                                },
                                creator: {
                                    id: 'uuid',
                                    display_name: 'string',
                                    profile_picture: 'string',
                                    credentials: {
                                        name: 'string'
                                    }
                                }
                            },
                            added_at: new Date(),
                            order_number: 1,
                        }
                    ],
                    {
                        id: 'uuid',
                        display_name: 'string',
                        profile_picture: 'string',
                        credentials: {
                            name: 'string'
                        }
                    },
                    new Date(),
                    new Date(),
                )
            ], 1, 1, 12)
        }
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Get()
    public async list(
        @Query() query: ListSpotFoldersQueryRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.listSpotFoldersCommand(query);
        
        const data = await this.listSpotFoldersUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Get spot folder' })
    @ApiOkResponse({
        example: {
            data: new GetSpotFolderDto(
                'uuid',
                'string',
                'string',
                '#000000',
                SpotFolderVisibility.PUBLIC,
                [
                    {
                        spot: {
                            id: 'uuid',
                            name: 'string',
                            description: 'string',
                            photos: [
                                {
                                    id: 'uuid',
                                    file_path: 'string',
                                }
                            ],
                            type: 'string',
                            address: {
                                area: 'string',
                                sub_area: 'string',
                                country_code: 'BR',
                                latitude: 0,
                                locality: 'string',
                                longitude: 0
                            },
                            creator: {
                                id: 'uuid',
                                display_name: 'string',
                                profile_picture: 'string',
                                credentials: {
                                    name: 'string'
                                }
                            }
                        },
                        added_at: new Date(),
                        order_number: 1,
                    }
                ],
                {
                    id: 'uuid',
                    display_name: 'string',
                    profile_picture: 'string',
                    credentials: {
                        name: 'string'
                    }
                },
                new Date(),
                new Date(),
            )
        }
    })
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Get(':id')
    public async get(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.getSpotFolderCommand(id);

        const data = await this.getSpotFolderUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Create spot folder' })
    @ApiOkResponse({
        example: new CreateSpotFolderDto(
            'uuid',
            'string',
            'string',
            '#000000',
            SpotFolderVisibility.PUBLIC,
            [{ spot_id: 'uuid' }],
            'uuid',
            new Date(),
            new Date(),
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Post()
    public async create(
        @Body() body: CreateSpotFolderRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.createSpotFolderCommand(body);

        const data = await this.createSpotFolderUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Update spot folder' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Put(':id')
    public async update(
        @Param('id') id: string,
        @Body() body: UpdateSpotFolderRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.updateSpotFolderCommand(id, body);

        const data = await this.updateSpotFolderUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Delete spot folder' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @Delete(':id')
    public async delete(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.deleteSpotFolderCommand(id);

        const data = await this.deleteSpotFolderUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Sort items' })
    @ApiOkResponse({
        example: {
            data: new GetSpotFolderDto(
                'uuid',
                'string',
                'string',
                '#000000',
                SpotFolderVisibility.PUBLIC,
                [
                    {
                        spot: {
                            id: 'uuid',
                            name: 'string',
                            description: 'string',
                            photos: [
                                {
                                    id: 'uuid',
                                    file_path: 'string',
                                }
                            ],
                            type: 'string',
                            address: {
                                area: 'string',
                                sub_area: 'string',
                                country_code: 'BR',
                                latitude: 0,
                                locality: 'string',
                                longitude: 0
                            },
                            creator: {
                                id: 'uuid',
                                display_name: 'string',
                                profile_picture: 'string',
                                credentials: {
                                    name: 'string'
                                }
                            }
                        },
                        added_at: new Date(),
                        order_number: 1,
                    }
                ],
                {
                    id: 'uuid',
                    display_name: 'string',
                    profile_picture: 'string',
                    credentials: {
                        name: 'string'
                    }
                },
                new Date(),
                new Date(),
            )
        }
    })
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Patch(':id/sort')
    public async sort(
        @Param('id') id: string,
        @Body() body: SortItemsRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.sortItemsCommand(id, body);

        const data = await this.sortItemsUseCase.execute(command);

        res.status(HttpStatus.OK).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Add spots' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Post(':id/spots')
    public async addSpots(
        @Param('id') id: string,
        @Body() body: AddSpotRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.addSpotCommand(id, body);

        const data = await this.addSpotUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json({
            data: data
        });
    }

    @ApiOperation({ summary: 'Remove spots' })
    @ApiNoContentResponse()
    @ApiNotFoundResponse({
        example: new ErrorResponse(
            'string',
            '2024-07-24 12:00:00',
            'string',
            'string',
        )
    })
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, forbidNonWhitelisted: true }))
    @Delete(':id/spots')
    public async removeSpots(
        @Param('id') id: string,
        @Body() body: RemoveSpotRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const command = SpotFolderRequestMapper.removeSpotCommand(id, body);

        const data = await this.removeSpotUseCase.execute(command);

        res.status(HttpStatus.NO_CONTENT).json({
            data: data
        });
    }
}