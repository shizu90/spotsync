import { Repository } from "src/common/common.repository";
import { User } from "src/user/domain/user.model";

export interface UserRepository extends Repository<User, string> 
{}