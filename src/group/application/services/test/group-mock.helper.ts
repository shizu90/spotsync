import { randomUUID } from 'crypto';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
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

export const mockGroupRole = (
	isImmutable = false,
	name = 'member',
): GroupRole => {
	return GroupRole.create(
		randomUUID(),
		name,
		'#000000',
		[
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.ACCEPT_REQUESTS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.UPDATE_SETTINGS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.DELETE_GROUP,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.DELETE_POSTS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.DELETE_EVENTS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.CREATE_POSTS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.CREATE_EVENTS,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.REMOVE_MEMBER,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.CREATE_ROLE,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.UPDATE_ROLE,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.REMOVE_ROLE,
			),
			GroupPermission.create(
				randomUUID(),
				GroupPermissionName.CHANGE_MEMBER_ROLE,
			),
		],
		isImmutable,
		null,
	);
};

export const mockGroupMember = (
	isCreator = false,
	isImmutable = false,
	role = 'member',
): GroupMember => {
	return GroupMember.create(
		randomUUID(),
		mockGroup(),
		mockUser(),
		mockGroupRole(isImmutable, role),
		isCreator,
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
