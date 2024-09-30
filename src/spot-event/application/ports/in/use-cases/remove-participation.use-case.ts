import { UseCase } from 'src/common/core/common.use-case';
import { RemoveParticipationCommand } from '../commands/remove-participation.command';

export const RemoveParticipationUseCaseProvider = 'RemoveParticipationUseCase';

export interface RemoveParticipationUseCase
	extends UseCase<RemoveParticipationCommand, Promise<void>> {}
