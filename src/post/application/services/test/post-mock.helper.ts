import { randomUUID } from 'crypto';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserStatus } from 'src/user/domain/user-status.enum';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { User } from 'src/user/domain/user.model';

export const mockUser = (): User => {
	const id = randomUUID();
	return User.create(
		id,
		UserProfile.create(
			id,
			new Date(),
			'Test',
			'#000000',
			'',
			'',
			'',
			UserVisibility.PUBLIC,
		),
		UserCredentials.create(
			id,
			'UserTest',
			'user.test@test.test',
			'TestPassword321',
			'11999999999',
		),
		UserVisibilitySettings.create(
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
		UserStatus.ACTIVE,
		new Date(),
		new Date(),
		false,
	);
};

export const mockPost = (parent?: Post): Post => {
	return Post.create(
		randomUUID(),
		'Test Title',
		'Test Content',
		PostVisibility.PUBLIC,
		mockUser(),
		[],
		null,
		[
			Post.create(
				randomUUID(),
				'Test Title',
				'Test Content',
				PostVisibility.PUBLIC,
				mockUser(),
				[],
				null,
				[
					Post.create(
						randomUUID(),
						'Test Title',
						'Test Content',
						PostVisibility.PUBLIC,
						mockUser(),
						[],
						null,
						[],
						null,
					),
				],
				null,
			),
		],
		null,
	);
};

export const mockGroup = (): Group => {
	const id = randomUUID();

	return Group.create(
		id,
		'Test Group',
		'Test About',
		null,
		null,
		GroupVisibilitySettings.create(
			id,
			GroupVisibility.PUBLIC,
			GroupVisibility.PUBLIC,
			GroupVisibility.PUBLIC,
		),
	);
};
