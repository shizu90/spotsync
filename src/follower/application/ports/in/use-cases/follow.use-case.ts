import { UseCase } from 'src/common/common.use-case';
import { FollowCommand } from '../commands/follow.command';
import { FollowDto } from '../../out/dto/follow.dto';

export const FollowUseCaseProvider = 'FollowUseCase';

export interface FollowUseCase
	extends UseCase<FollowCommand, Promise<FollowDto>> {}
