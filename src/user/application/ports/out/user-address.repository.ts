import { Repository } from "src/common/common.repository";
import { Pagination } from "src/common/pagination.dto";
import { UserAddress } from "src/user/domain/user-address.model";

export interface UserAddressRepository extends Repository<UserAddress, string> 
{
    findByUserId(userId: string): Pagination<UserAddress>;
    findByUserIdAndMain(userId: string, main: boolean): Array<UserAddress>;
}