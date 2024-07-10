import { Repository } from "src/common/common.repository";
import { GroupVisibilityConfig } from "src/group/domain/group-visibility-config.model";
import { Group } from "src/group/domain/group.model";

export const GroupRepositoryProvider = "GroupRepository";

export interface GroupRepository extends Repository<Group, string> 
{
    updateVisibilityConfiguration(model: GroupVisibilityConfig): Promise<Group>
}