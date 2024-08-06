import { UseCase } from 'src/common/core/common.use-case';
import { SignOutCommand } from '../commands/sign-out.command';

export const SignOutUseCaseProvider = 'SignOutUseCase';

export interface SignOutUseCase
	extends UseCase<SignOutCommand, Promise<void>> {}
