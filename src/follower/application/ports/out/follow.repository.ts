import { Repository } from "src/common/common.repository";
import { FollowRequest } from "src/follower/domain/follow-request.model";
import { Follow } from "src/follower/domain/follow.model";

export const FollowRepositoryProvider = "FollowRepository";

export interface FollowRepository extends Repository<Follow, string> 
{
    storeRequest(model: FollowRequest): Promise<FollowRequest>;
    findRequestById(id: string): Promise<FollowRequest>;
    deleteRequest(id: string): Promise<void>;
}