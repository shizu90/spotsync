import { PaginateParameters, Pagination, Repository } from "src/common/common.repository";
import { GroupMemberRequest } from "src/group/domain/group-member-request.model";
import { GroupMember } from "src/group/domain/group-member.model";

export const GroupMemberRepositoryProvider = "GroupMemberRepository";

export interface GroupMemberRepository extends Repository<GroupMember, string> 
{
    paginateRequest(params: PaginateParameters): Promise<Pagination<GroupMemberRequest>>;
    storeRequest(model: GroupMemberRequest): Promise<GroupMemberRequest>;
    findRequestBy(values: Object): Promise<Array<GroupMemberRequest>>;
    findRequestById(id: string): Promise<GroupMemberRequest>;
    deleteRequest(id: string): Promise<void>;
}