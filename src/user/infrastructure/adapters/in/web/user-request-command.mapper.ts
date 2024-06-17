import { CreateUserCommand } from "src/user/application/ports/in/create-user.command";
import { CreateUserRequest } from "./requests/create-user.request";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/delete-user.command";

export class UserRequestCommandMapper 
{
    public static createUserCommand(request: CreateUserRequest): CreateUserCommand 
    {
        return new CreateUserCommand(request.name, request.email, request.password, request.birthDate);
    }

    public static updateUserProfileCommand(id: string, request: UpdateUserProfileRequest): UpdateUserProfileCommand 
    {
        return new UpdateUserProfileCommand(id, request.profilePicture, request.bannerPicture, request.biograph, request.birthDate);
    }

    public static updateUserCredentialsCommand(id: string, request: UpdateUserCredentialsRequest): UpdateUserCredentialsCommand
    {
        return new UpdateUserCredentialsCommand(id, request.name, request.email, request.password);
    }

    public static deleteUserCommand(id: string): DeleteUserCommand 
    {
        return new DeleteUserCommand(id);
    }
}