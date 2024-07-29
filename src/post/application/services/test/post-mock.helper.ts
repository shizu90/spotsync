import { randomUUID } from 'crypto';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
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
						null
					)
				],
				null
			)
		],
		null
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
		GroupVisibilityConfig.create(
			id,
			GroupVisibility.PUBLIC,
			GroupVisibility.PUBLIC,
			GroupVisibility.PUBLIC,
		),
	);
};
