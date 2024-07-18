import { UseCase } from 'src/common/common.use-case';

export const GetAuthenticatedUserUseCaseProvider =
	'GetAuthenticatedUserUseCase';

export interface GetAuthenticatedUserUseCase extends UseCase<null, string> {}
