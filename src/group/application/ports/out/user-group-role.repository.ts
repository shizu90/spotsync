import { Repository } from "src/common/common.repository";
import { UserGroupRole } from "src/group/domain/user-group-role.model";

export const UserGroupRoleRepositoryProvider = "UserGroupRoleRepository";

export interface UserGroupRoleRepository extends Repository<UserGroupRole, string> 
{
    findByName(name: string): Promise<UserGroupRole>;
}