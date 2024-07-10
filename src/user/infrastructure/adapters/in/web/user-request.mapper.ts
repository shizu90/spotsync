import { CreateUserCommand } from "src/user/application/ports/in/commands/create-user.command";
import { CreateUserRequest } from "./requests/create-user.request";
import { UpdateUserProfileRequest } from "./requests/update-user-profile.request";
import { UpdateUserProfileCommand } from "src/user/application/ports/in/commands/update-user-profile.command";
import { UpdateUserCredentialsRequest } from "./requests/update-user-credentials.request";
import { UpdateUserCredentialsCommand } from "src/user/application/ports/in/commands/update-user-credentials.command";
import { DeleteUserCommand } from "src/user/application/ports/in/commands/delete-user.command";
import { CreateUserAddressCommand } from "src/user/application/ports/in/commands/create-user-address.command";
import { UpdateUserAddressRequest } from "./requests/update-user-address.request";
import { CreateUserAddressRequest } from "./requests/create-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/commands/update-user-address.command";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/commands/delete-user-address.command";
import { GetUserAddressesCommand } from "src/user/application/ports/in/commands/get-user-addresses.command";
import { GetUserAddressCommand } from "src/user/application/ports/in/commands/get-user-address.command";
import { GetUserProfileCommand } from "src/user/application/ports/in/commands/get-user-profile.command";
import { UpdateUserVisibilityConfigRequest } from "./requests/update-user-visibility-config.request";
import { UpdateUserVisibilityConfigCommand } from "src/user/application/ports/in/commands/update-user-visibility-config.command";
import { ListUsersCommand } from "src/user/application/ports/in/commands/list-users.command";

export class UserRequestMapper 
{
    public static getUserProfileCommand(id: string, name: string): GetUserProfileCommand 
    {
        return new GetUserProfileCommand(id, name);
    }

    public static listUsersCommand(query: {name?: string, sort?: string, sortDirection?: 'asc' | 'desc', page?: number, paginate?: boolean, limit?: number}): ListUsersCommand 
    {
        return new ListUsersCommand(query.name, query.sort, query.sortDirection, query.page, query.paginate, query.limit);
    }

    public static createUserCommand(request: CreateUserRequest): CreateUserCommand 
    {
        return new CreateUserCommand(request.name, request.email, request.password, request.birth_date);
    }

    public static updateUserProfileCommand(id: string, request: UpdateUserProfileRequest): UpdateUserProfileCommand 
    {
        return new UpdateUserProfileCommand(id, request.profile_picture, request.banner_picture, request.biograph, request.birth_date);
    }

    public static updateUserCredentialsCommand(id: string, request: UpdateUserCredentialsRequest): UpdateUserCredentialsCommand
    {
        return new UpdateUserCredentialsCommand(id, request.name, request.email, request.password);
    }

    public static updateUserVisibilityConfigCommand(id: string, request: UpdateUserVisibilityConfigRequest): UpdateUserVisibilityConfigCommand 
    {
        return new UpdateUserVisibilityConfigCommand(id, request.profile_visibility, request.poi_folder_visibility, request.visited_poi_visibility, request.address_visibility, request.post_visibility);
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
        return new CreateUserAddressCommand(userId, request.name, request.area, request.sub_area, request.locality, request.country_code, request.main);
    }

    public static updateUserAddressCommand(addressId: string, userId: string, request: UpdateUserAddressRequest): UpdateUserAddressCommand 
    {
        return new UpdateUserAddressCommand(addressId, userId, request.name, request.area, request.sub_area, request.locality, request.country_code, request.main);
    }

    public static deleteUserAddressCommand(addressId: string, userId: string): DeleteUserAddressCommand 
    {
        return new DeleteUserAddressCommand(addressId, userId);
    }
}