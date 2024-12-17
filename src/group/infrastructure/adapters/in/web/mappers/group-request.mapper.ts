import { CreateGroupCommand } from 'src/group/application/ports/in/commands/create-group.command';
import { DeleteGroupCommand } from 'src/group/application/ports/in/commands/delete-group.command';
import { GetGroupBannerPictureCommand } from 'src/group/application/ports/in/commands/get-group-banner-picture.command';
import { GetGroupHistoryCommand } from 'src/group/application/ports/in/commands/get-group-history.command';
import { GetGroupPictureCommand } from 'src/group/application/ports/in/commands/get-group-picture.command';
import { GetGroupCommand } from 'src/group/application/ports/in/commands/get-group.command';
import { ListGroupsCommand } from 'src/group/application/ports/in/commands/list-groups.command';
import { UpdateGroupVisibilityCommand } from 'src/group/application/ports/in/commands/update-group-visibility.command';
import { UpdateGroupCommand } from 'src/group/application/ports/in/commands/update-group.command';
import { CreateGroupRequest } from '../requests/create-group.request';
import { GetGroupHistoryQueryRequest } from '../requests/get-group-history-query.request';
import { ListGroupsQueryRequest } from '../requests/list-groups-query.request';
import { UpdateGroupVisibilityRequest } from '../requests/update-group-visibility.request';
import { UpdateGroupRequest } from '../requests/update-group.request';

export class GroupRequestMapper {
	public static listGroupsCommand(
		query: ListGroupsQueryRequest,
	): ListGroupsCommand {
		return new ListGroupsCommand(
			query.name,
			query.group_visibility,
			query.sort,
			query.sort_direction,
			query.page,
			query.paginate,
			query.limit,
		);
	}

	public static getGroupCommand(id: string): GetGroupCommand {
		return new GetGroupCommand(id);
	}

	public static createGroupCommand(
		request: CreateGroupRequest,
		groupPicture?: Express.Multer.File,
		bannerPicture?: Express.Multer.File,
	): CreateGroupCommand {
		return new CreateGroupCommand(request.name, request.about, groupPicture, bannerPicture);
	}

	public static updateGroupCommand(
		id: string,
		request: UpdateGroupRequest,
		groupPicture?: Express.Multer.File,
		bannerPicture?: Express.Multer.File,
	): UpdateGroupCommand {
		return new UpdateGroupCommand(id, request.name, request.about, groupPicture, bannerPicture);
	}

	public static updateGroupVisibilityCommand(
		id: string,
		request: UpdateGroupVisibilityRequest,
	): UpdateGroupVisibilityCommand {
		return new UpdateGroupVisibilityCommand(
			id,
			request.groups,
			request.posts,
			request.spot_events,
		);
	}

	public static deleteGroupCommand(id: string): DeleteGroupCommand {
		return new DeleteGroupCommand(id);
	}

	public static getGroupHistoryCommand(
		id: string,
		query: GetGroupHistoryQueryRequest,
	): GetGroupHistoryCommand {
		return new GetGroupHistoryCommand(
			id,
			query.sort,
			query.sort_direction,
			query.paginate,
			query.page,
			query.limit,
		);
	}

	public static getGroupPictureCommand(id: string): GetGroupPictureCommand {
		return new GetGroupPictureCommand(id);
	}

	public static getGroupBannerPictureCommand(id: string): GetGroupBannerPictureCommand {
		return new GetGroupBannerPictureCommand(id);
	}
}
