import { Repository } from 'src/common/core/common.repository';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';

export const GroupRoleRepositoryProvider = 'GroupRoleRepository';

export interface GroupRoleRepository extends Repository<GroupRole, string> {
	findByName(name: string): Promise<GroupRole>;
	findPermissionById(id: string): Promise<GroupPermission>;
}
