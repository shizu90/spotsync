import { GetUserAddressCommand } from "src/user/application/ports/in/commands/get-user-address.command";
import { ListUserAddressesCommand } from "src/user/application/ports/in/commands/list-user-addresses.command";
import { CreateUserAddressRequest } from "../requests/create-user-address.request";
import { CreateUserAddressCommand } from "src/user/application/ports/in/commands/create-user-address.command";
import { UpdateUserAddressRequest } from "../requests/update-user-address.request";
import { UpdateUserAddressCommand } from "src/user/application/ports/in/commands/update-user-address.command";
import { DeleteUserAddressCommand } from "src/user/application/ports/in/commands/delete-user-address.command";
import { ListUserAddressesQueryRequest } from "../requests/list-user-addresses-query.request";

export class UserAddressRequestMapper 
{
    public static getUserAddressCommand(addressId: string, userId: string): GetUserAddressCommand 
    {
        return new GetUserAddressCommand(userId, addressId);
    }

    public static listUserAddressesCommand(userId: string, query: ListUserAddressesQueryRequest): ListUserAddressesCommand 
    {
        return new ListUserAddressesCommand(
            userId,
            query.name,
            query.main,
            query.sort,
            query.sort_direction,
            query.paginate,
            query.page,
            query.limit
        );
    }

    public static createUserAddressCommand(userId: string, request: CreateUserAddressRequest): CreateUserAddressCommand 
    {
        return new CreateUserAddressCommand(
            userId, 
            request.name, 
            request.area, 
            request.sub_area, 
            request.locality, 
            request.country_code, 
            request.main
        );
    }

    public static updateUserAddressCommand(addressId: string, userId: string, request: UpdateUserAddressRequest): UpdateUserAddressCommand 
    {
        return new UpdateUserAddressCommand(
            addressId, 
            userId, 
            request.name, 
            request.area, 
            request.sub_area, 
            request.locality, 
            request.country_code, 
            request.main
        );
    }

    public static deleteUserAddressCommand(addressId: string, userId: string): DeleteUserAddressCommand 
    {
        return new DeleteUserAddressCommand(
            addressId, 
            userId
        );
    }
}