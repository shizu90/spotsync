import { UseCase } from 'src/common/core/common.use-case';
import { FollowDto } from '../../out/dto/follow.dto';
import { FollowCommand } from '../commands/follow.command';

export const FollowUseCaseProvider = 'FollowUseCase';

export interface FollowUseCase
	extends UseCase<FollowCommand, Promise<FollowDto>> {}
