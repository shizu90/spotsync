import { UseCase } from 'src/common/common.use-case';
import { AcceptGroupRequestCommand } from '../commands/accept-group-request.command';
import { AcceptGroupRequestDto } from '../../out/dto/accept-group-request.dto';

export const AcceptGroupRequestUseCaseProvider = 'AcceptGroupRequestUseCase';

export interface AcceptGroupRequestUseCase
	extends UseCase<
		AcceptGroupRequestCommand,
		Promise<AcceptGroupRequestDto>
	> {}
