import { Repository } from "src/common/common.repository";
import { UserGroupVisibilityConfig } from "src/group/domain/user-group-visibility-config.model";
import { UserGroup } from "src/group/domain/user-group.model";

export const UserGroupRepositoryProvider = "UserGroupRepository";

export interface UserGroupRepository extends Repository<UserGroup, string> 
{
    updateVisibilityConfiguration(model: UserGroupVisibilityConfig): Promise<UserGroup>
}