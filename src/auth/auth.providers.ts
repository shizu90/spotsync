import { Provider } from "@nestjs/common";
import { SignInUseCaseProvider } from "./application/ports/in/use-cases/sign-in.use-case";
import { SignInService } from "./application/services/sign-in.service";
import { SignOutUseCaseProvider } from "./application/ports/in/use-cases/sign-out.use-case";
import { SignOutService } from "./application/services/sign-out.service";

export const Providers: Provider[] = [
    {
        provide: SignInUseCaseProvider,
        useClass: SignInService
    },
    {
        provide: SignOutUseCaseProvider,
        useClass: SignOutService
    }
]