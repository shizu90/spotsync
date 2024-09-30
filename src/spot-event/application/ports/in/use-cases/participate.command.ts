import { UseCase } from 'src/common/core/common.use-case';
import { ParticipateCommand } from '../commands/participate.command';

export const ParticipateUseCaseProvider = 'ParticipateUseCase';

export interface ParticipateUseCase
	extends UseCase<ParticipateCommand, Promise<void>> {}
