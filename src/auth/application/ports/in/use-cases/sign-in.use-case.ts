import { UseCase } from 'src/common/core/common.use-case';
import { SignInDto } from '../../out/dto/sign-in.dto';
import { SignInCommand } from '../commands/sign-in.command';

export const SignInUseCaseProvider = 'SignInUseCase';

export interface SignInUseCase
	extends UseCase<SignInCommand, Promise<SignInDto>> {}
