import { UseCase } from 'src/common/core/common.use-case';
import { RefuseFollowRequestCommand } from '../commands/refuse-follow-request.command';

export const RefuseFollowRequestUseCaseProvider = 'RefuseFollowRequestUseCase';

export interface RefuseFollowRequestUseCase
	extends UseCase<RefuseFollowRequestCommand, Promise<void>> {}
