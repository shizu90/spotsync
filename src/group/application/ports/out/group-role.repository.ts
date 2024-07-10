import { Repository } from "src/common/common.repository";
import { GroupRole } from "src/group/domain/group-role.model";

export const GroupRoleRepositoryProvider = "GroupRoleRepository";

export interface GroupRoleRepository extends Repository<GroupRole, string> 
{
    findByName(name: string): Promise<GroupRole>;
}