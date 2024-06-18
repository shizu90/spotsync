import { Repository } from "src/common/common.repository";
import { UserCredentials } from "src/user/domain/user-credentials.model";

export interface UserCredentialsRepository extends Repository<UserCredentials, string> 
{
    findByEmail(email: string): UserCredentials;
    findByName(name: string): UserCredentials;
}