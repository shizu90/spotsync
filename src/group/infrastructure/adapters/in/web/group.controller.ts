import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UploadedFiles,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/adapters/in/web/handlers/auth.guard';
import { ApiController } from 'src/common/web/common.controller';
import { ErrorResponse } from 'src/common/web/common.error';
import {
	CreateGroupUseCase,
	CreateGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/create-group.use-case';
import {
	DeleteGroupUseCase,
	DeleteGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/delete-group.use-case';
import { GetGroupBannerPictureUseCase, GetGroupBannerPictureUseCaseProvider } from 'src/group/application/ports/in/use-cases/get-group-banner-picture.use-case';
import {
	GetGroupHistoryUseCase,
	GetGroupHistoryUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/get-group-history.use-case';
import { GetGroupPictureUseCase, GetGroupPictureUseCaseProvider } from 'src/group/application/ports/in/use-cases/get-group-picture.use-case';
import {
	GetGroupUseCase,
	GetGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/get-group.use-case';
import {
	ListGroupsUseCase,
	ListGroupsUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/list-groups.use-case';
import {
	UpdateGroupVisibilityUseCase,
	UpdateGroupVisibilityUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/update-group-visibility.use-case';
import {
	UpdateGroupUseCase,
	UpdateGroupUseCaseProvider,
} from 'src/group/application/ports/in/use-cases/update-group.use-case';
import { GroupLogDto } from 'src/group/application/ports/out/dto/group-log.dto';
import { GroupDto } from 'src/group/application/ports/out/dto/group.dto';
import { GroupErrorHandler } from './handlers/group-error.handler';
import { GroupRequestMapper } from './mappers/group-request.mapper';
import { CreateGroupRequest } from './requests/create-group.request';
import { ListGroupsQueryRequest } from './requests/list-groups-query.request';
import { UpdateGroupVisibilityRequest } from './requests/update-group-visibility.request';
import { UpdateGroupRequest } from './requests/update-group.request';

@ApiTags('Groups')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@ApiInternalServerErrorResponse({ type: ErrorResponse })
@ApiForbiddenResponse({ type: ErrorResponse })
@UseFilters(new GroupErrorHandler())
@Controller('groups')
export class GroupController extends ApiController {
	constructor(
		@Inject(CreateGroupUseCaseProvider)
		protected createGroupUseCase: CreateGroupUseCase,
		@Inject(UpdateGroupUseCaseProvider)
		protected updateGroupUseCase: UpdateGroupUseCase,
		@Inject(UpdateGroupVisibilityUseCaseProvider)
		protected updateGroupVisibilityUseCase: UpdateGroupVisibilityUseCase,
		@Inject(DeleteGroupUseCaseProvider)
		protected deleteGroupUseCase: DeleteGroupUseCase,
		@Inject(ListGroupsUseCaseProvider)
		protected listGroupsUseCase: ListGroupsUseCase,
		@Inject(GetGroupUseCaseProvider)
		protected getGroupUseCase: GetGroupUseCase,
		@Inject(GetGroupHistoryUseCaseProvider)
		protected getGroupHistoryUseCase: GetGroupHistoryUseCase,
		@Inject(GetGroupPictureUseCaseProvider)
		protected getGroupPictureUseCase: GetGroupPictureUseCase,
		@Inject(GetGroupBannerPictureUseCaseProvider)
		protected getGroupBannerPictureUseCase: GetGroupBannerPictureUseCase,
	) {
		super();
	}

	@ApiOperation({ summary: 'List groups' })
	@ApiOkResponse({ type: Array<GroupDto> })
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
		@Query() query: ListGroupsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.listGroupsCommand(query);

		const data = await this.listGroupsUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Find group by id' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: GroupDto })
	@UseGuards(AuthGuard)
	@Get(':id')
	public async getById(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupCommand(id);

		const data = await this.getGroupUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Create group' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiCreatedResponse({ type: GroupDto })
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'picture', maxCount: 1 },
			{ name: 'bannerPicture', maxCount: 1 },
		])
	)
	@Post()
	public async create(
		@Body() request: CreateGroupRequest,
		@UploadedFiles() files: { picture?: Express.Multer.File[], bannerPicture?: Express.Multer.File[] },
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.createGroupCommand(request, files.picture?.[0], files.bannerPicture?.[0]);

		const data = await this.createGroupUseCase.execute(command);

		res.status(HttpStatus.CREATED).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Update group' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'picture', maxCount: 1 },
			{ name: 'bannerPicture', maxCount: 1 },
		])
	)
	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() request: UpdateGroupRequest,
		@UploadedFiles() files: { picture?: Express.Multer.File[], bannerPicture?: Express.Multer.File[] },
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.updateGroupCommand(id, request, files.picture?.[0], files.bannerPicture?.[0]);

		await this.updateGroupUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Update group visibility' })
	@ApiUnprocessableEntityResponse({ type: ErrorResponse })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			forbidNonWhitelisted: true,
		}),
	)
	@Put(':id/visibility')
	public async updateVisibility(
		@Param('id') id: string,
		@Body() request: UpdateGroupVisibilityRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.updateGroupVisibilityCommand(
			id,
			request,
		);

		await this.updateGroupVisibilityUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Delete group' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiNoContentResponse()
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async delete(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.deleteGroupCommand(id);

		await this.deleteGroupUseCase.execute(command);

		res.status(HttpStatus.NO_CONTENT).json();
	}

	@ApiOperation({ summary: 'Get group history' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse({ type: Array<GroupLogDto> })
	@UseGuards(AuthGuard)
	@Get(':id/history')
	public async getHistory(
		@Param('id') id: string,
		@Query() query: ListGroupsQueryRequest,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupHistoryCommand(id, query);

		const data = await this.getGroupHistoryUseCase.execute(command);

		res.status(HttpStatus.OK).json({
			data: data,
		});
	}

	@ApiOperation({ summary: 'Get group picture' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse()
	@Get(':id/picture')
	public async getPicture(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupPictureCommand(id);

		const file = await this.getGroupPictureUseCase.execute(command);

		file.pipe(res);
	}

	@ApiOperation({ summary: 'Get group banner picture' })
	@ApiNotFoundResponse({ type: ErrorResponse })
	@ApiOkResponse()
	@Get(':id/banner-picture')
	public async getBannerPicture(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const command = GroupRequestMapper.getGroupBannerPictureCommand(id);

		const file = await this.getGroupBannerPictureUseCase.execute(command);

		file.pipe(res);
	}
}
