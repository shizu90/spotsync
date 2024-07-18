import { UseCase } from 'src/common/common.use-case';
import { RefuseFollowRequestCommand } from '../commands/refuse-follow-request.command';

export const RefuseFollowRequestUseCaseProvider = 'RefuseFollowRequestUseCase';

export interface RefusseFollowRequestUseCase
	extends UseCase<RefuseFollowRequestCommand, Promise<void>> {}
