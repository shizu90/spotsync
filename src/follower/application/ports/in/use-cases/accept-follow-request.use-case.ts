import { UseCase } from 'src/common/core/common.use-case';
import { AcceptFollowRequestCommand } from '../commands/accept-follow-request.command';

export const AcceptFollowRequestUseCaseProvider = 'AcceptFollowRequestUseCase';

export interface AcceptFollowRequestUseCase
	extends UseCase<AcceptFollowRequestCommand, Promise<void>> {}
