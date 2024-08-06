import { UseCase } from 'src/common/core/common.use-case';
import { UnfollowCommand } from '../commands/unfollow.command';

export const UnfollowUseCaseProvider = 'UnfollowUseCase';

export interface UnfollowUseCase
	extends UseCase<UnfollowCommand, Promise<void>> {}
