import { UseCase } from 'src/common/common.use-case';
import { LikeDto } from '../../out/dto/like.dto';
import { LikeCommand } from '../commands/like.command';

export const LikeUseCaseProvider = 'LikeUseCase';

export interface LikeUseCase extends UseCase<LikeCommand, Promise<LikeDto>> {}
