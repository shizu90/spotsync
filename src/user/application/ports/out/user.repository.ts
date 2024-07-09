import { UserCredentials } from "src/user/domain/user-credentials.model";
import { Repository } from "src/common/common.repository";
import { User } from "src/user/domain/user.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";

export const UserRepositoryProvider = 'UserRepository';

export interface UserRepository extends Repository<User, string> 
{
    findByName(name: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    updateCredentials(credentials: UserCredentials): Promise<User>;
    updateVisibilityConfig(userVisibilityConfig: UserVisibilityConfig): Promise<User>;
}