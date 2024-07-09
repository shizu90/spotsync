import { Repository } from "src/common/common.repository";
import { UserGroupMemberRequest } from "src/group/domain/user-group-member-request.model";
import { UserGroupMember } from "src/group/domain/user-group-member.model";

export const UserGroupMemberRepositoryProvider = "UserGroupMemberRepository";

export interface UserGroupMemberRepository extends Repository<UserGroupMember, string> 
{
    storeRequest(model: UserGroupMemberRequest): Promise<UserGroupMemberRequest>;
    findRequestById(id: string): Promise<UserGroupMemberRequest>;
    deleteRequest(id: string): Promise<void>;
}