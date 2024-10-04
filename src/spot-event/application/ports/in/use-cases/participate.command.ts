import { UseCase } from 'src/common/core/common.use-case';
import { SpotEventParticipantDto } from '../../out/dto/spot-event-participant.dto';
import { ParticipateCommand } from '../commands/participate.command';

export const ParticipateUseCaseProvider = 'ParticipateUseCase';

export interface ParticipateUseCase
	extends UseCase<ParticipateCommand, Promise<SpotEventParticipantDto>> {}
