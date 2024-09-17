import { Repository } from 'src/common/core/common.repository';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

export const UserRepositoryProvider = 'UserRepository';

export interface UserRepository extends Repository<User, string> {
	findByName(name: string): Promise<User>;
	findByEmail(email: string): Promise<User>;
	updateCredentials(credentials: UserCredentials): Promise<void>;
	updateProfile(profile: UserProfile): Promise<void>;
	updateVisibilitySettings(
		userVisibilitySettings: UserVisibilitySettings,
	): Promise<void>;
}
