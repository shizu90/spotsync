import {
	PaginateParameters,
	Pagination,
	Repository,
} from 'src/common/core/common.repository';
import { GroupLog } from 'src/group/domain/group-log.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { Group } from 'src/group/domain/group.model';

export const GroupRepositoryProvider = 'GroupRepository';

export interface GroupRepository extends Repository<Group, string> {
	updateVisibilitySettings(model: GroupVisibilitySettings): Promise<void>;
	storeLog(model: GroupLog): Promise<GroupLog>;
	paginateLog(params: PaginateParameters): Promise<Pagination<GroupLog>>;
}
