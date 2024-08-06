import {
	PaginateParameters,
	Pagination,
	Repository,
} from 'src/common/core/common.repository';
import { FollowRequest } from 'src/follower/domain/follow-request.model';
import { Follow } from 'src/follower/domain/follow.model';

export const FollowRepositoryProvider = 'FollowRepository';

export interface FollowRepository extends Repository<Follow, string> {
	paginateRequest(
		params: PaginateParameters,
	): Promise<Pagination<FollowRequest>>;
	storeRequest(model: FollowRequest): Promise<FollowRequest>;
	findRequestById(id: string): Promise<FollowRequest>;
	findRequestBy(values: Object): Promise<Array<FollowRequest>>;
	deleteRequest(id: string): Promise<void>;
}
