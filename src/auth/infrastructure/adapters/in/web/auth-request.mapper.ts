import { SignInCommand } from 'src/auth/application/ports/in/commands/sign-in.command';
import { SignInRequest } from './requests/sign-in.request';
import { SignOutCommand } from 'src/auth/application/ports/in/commands/sign-out.command';

export class AuthRequestMapper {
  public static signInCommand(request: SignInRequest): SignInCommand {
    return new SignInCommand(request.name, request.email, request.password);
  }

  public static signOutCommand(userId: string): SignOutCommand {
    return new SignOutCommand(userId);
  }
}
