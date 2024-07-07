import { Repository } from "src/common/common.repository";
import { UserAddress } from "src/user/domain/user-address.model";

export const UserAddressRepositoryProvider = 'UserAddressRepository';

export interface UserAddressRepository extends Repository<UserAddress, string> 
{
    findByUserId(userId: string): Promise<Array<UserAddress>>;
    findByUserIdAndMain(userId: string, main: boolean): Promise<Array<UserAddress>>;
}