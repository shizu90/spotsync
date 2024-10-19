import { Provider } from '@nestjs/common';
import { GetAuthenticatedUserUseCaseProvider } from './application/ports/in/use-cases/get-authenticated-user.use-case';
import { SignInUseCaseProvider } from './application/ports/in/use-cases/sign-in.use-case';
import { GetAuthenticatedUserService } from './application/services/get-authenticated-user.service';
import { SignInService } from './application/services/sign-in.service';
import { TokenService } from './infrastructure/adapters/in/web/handlers/token.service';

export const Providers: Provider[] = [
	{
		provide: SignInUseCaseProvider,
		useClass: SignInService,
	},
	{
		provide: GetAuthenticatedUserUseCaseProvider,
		useClass: GetAuthenticatedUserService,
	},
	{
		provide: TokenService,
		useClass: TokenService,
	}
];
