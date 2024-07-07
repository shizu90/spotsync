import { Repository } from "src/common/common.repository";
import { UserAddress } from "src/user/domain/user-address.model";

export const UserAddressRepositoryProvider = 'UserAddressRepository';

export interface UserAddressRepository extends Repository<UserAddress, string> 
{}