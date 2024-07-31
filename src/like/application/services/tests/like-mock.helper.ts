import { randomUUID } from 'crypto';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { Like } from 'src/like/domain/like.model';
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

export const mockLike = (): Like => {
	return Like.create(
		randomUUID(),
		LikableSubject.POST,
		randomUUID(),
		mockUser(),
	);
};
