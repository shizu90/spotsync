import { randomUUID } from 'crypto';
import { SpotAddress } from 'src/spot/domain/spot-address.model';
import { SpotType } from 'src/spot/domain/spot-type.enum';
import { Spot } from 'src/spot/domain/spot.model';
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
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
			UserVisibility.PUBLIC,
		),
		new Date(),
		new Date(),
		false,
	);
};

export const mockSpot = (): Spot => {
	return Spot.create(
		randomUUID(),
		'Name',
		'Description',
		SpotType.MALL,
		SpotAddress.create(
			randomUUID(),
			'Area',
			'Sub area',
			0,
			0,
			'BR',
			'Locality',
		),
		[],
		mockUser(),
	);
};
