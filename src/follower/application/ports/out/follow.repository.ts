import { Repository } from "src/common/common.repository";
import { Follow } from "src/follower/domain/follow.model";

export const FollowRepositoryProvider = "FollowRepository";

export interface FollowRepository extends Repository<Follow, string> 
{}