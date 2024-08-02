import {
	PaginateParameters,
	Pagination,
	Repository,
} from 'src/common/common.repository';
import { GroupLog } from 'src/group/domain/group-log.model';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { Group } from 'src/group/domain/group.model';

export const GroupRepositoryProvider = 'GroupRepository';

export interface GroupRepository extends Repository<Group, string> {
	updateVisibilityConfiguration(model: GroupVisibilityConfig): Promise<void>;
	storeLog(model: GroupLog): Promise<GroupLog>;
	paginateLog(params: PaginateParameters): Promise<Pagination<GroupLog>>;
}
