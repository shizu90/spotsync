import { UseCase } from 'src/common/common.use-case';
import { SignInCommand } from '../commands/sign-in.command';
import { SignInDto } from '../../out/dto/sign-in.dto';

export const SignInUseCaseProvider = 'SignInUseCase';

export interface SignInUseCase
  extends UseCase<SignInCommand, Promise<SignInDto>> {}
