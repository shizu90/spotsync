import { SignInCommand } from "src/auth/application/ports/in/commands/sign-in.command";
import { SignInRequest } from "./requests/sign-in.request";
import { SignOutCommand } from "src/auth/application/ports/in/commands/sign-out.command";

export class AuthRequestMapper 
{
    public static signInCommand(request: SignInRequest) 
    {
        return new SignInCommand(request.name, request.email, request.password);
    }

    public static signOutCommand(userId: string) 
    {
        return new SignOutCommand(userId);
    }
}