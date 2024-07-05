import { CreateUserCommand } from "src/user/application/ports/in/create-user.command";
import { CreateUserRequest } from "./requests/create-user.request";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/delete-user.command";
import { CreateUserAddressCommand } from "src/user/application/ports/in/create-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/update-user-address.command";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/delete-user-address.command";
import { GetUserCommand } from "src/user/application/ports/in/get-user.command";
import { GetUserAddressesCommand } from "src/user/application/ports/in/get-user-addresses.command";
import { GetUserAddressCommand } from "src/user/application/ports/in/get-user-address.command";

export class UserDtoMapper 
{
    public static getUserCommand(id: string): GetUserCommand 
    {
        return new GetUserCommand(id);
    }

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

    public static getUserAddressCommand(addressId: string, userId: string): GetUserAddressCommand 
    {
        return new GetUserAddressCommand(userId, addressId);
    }

    public static getUserAddressesCommand(userId: string): GetUserAddressesCommand 
    {
        return new GetUserAddressesCommand(userId);
    }

    public static createUserAddressCommand(userId: string, request: CreateUserAddressRequest): CreateUserAddressCommand 
    {
        return new CreateUserAddressCommand(userId, request.name, request.area, request.subArea, request.locality, request.countryCode, request.main);
    }

    public static updateUserAddressCommand(addressId: string, userId: string, request: UpdateUserAddressRequest): UpdateUserAddressCommand 
    {
        return new UpdateUserAddressCommand(addressId, userId, request.name, request.area, request.subArea, request.locality, request.countryCode, request.main);
    }

    public static deleteUserAddressCommand(addressId: string, userId: string): DeleteUserAddressCommand 
    {
        return new DeleteUserAddressCommand(addressId, userId);
    }
}