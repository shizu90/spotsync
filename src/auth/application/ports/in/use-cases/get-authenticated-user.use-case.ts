import { UseCase } from 'src/common/common.use-case';
import { User } from 'src/user/domain/user.model';

export const GetAuthenticatedUserUseCaseProvider =
	'GetAuthenticatedUserUseCase';

export interface GetAuthenticatedUserUseCase
	extends UseCase<null, Promise<User>> {}
