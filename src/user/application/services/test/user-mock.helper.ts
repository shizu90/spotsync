import { randomUUID } from 'crypto';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';

export const mockUser = (): User => {
	const id = randomUUID();
	return User.create(
		id,
		'User',
		'Test',
		null,
		null,
		null,
		null,
		null,
		UserCredentials.create(
			id,
			'UserTest',
			'user.test@test.test',
			'TestPassword321',
			'11999999999',
		),
		UserVisibilityConfig.create(
			id,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
		),
		new Date(),
		new Date(),
		false,
	);
};

export const mockUserAddress = (): UserAddress => {
	return UserAddress.create(
		randomUUID(),
		'Test Address',
		'Test Area',
		'Test Subarea',
		'Test Locality',
		0,
		0,
		'BR',
		true,
		mockUser(),
	);
};
