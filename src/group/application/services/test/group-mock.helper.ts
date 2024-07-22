import { randomUUID } from "crypto";
import { GroupMemberRequest } from "src/group/domain/group-member-request.model";
import { GroupMember } from "src/group/domain/group-member.model";
import { GroupPermission } from "src/group/domain/group-permission.model";
import { GroupRole } from "src/group/domain/group-role.model";
import { GroupVisibilityConfig } from "src/group/domain/group-visibility-config.model";
import { GroupVisibility } from "src/group/domain/group-visibility.enum";
import { Group } from "src/group/domain/group.model";
import { PermissionName } from "src/group/domain/permission-name.enum";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { User } from "src/user/domain/user.model";

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

export const mockGroupRole = (isImmutable = false, name = 'member'): GroupRole => {
    return GroupRole.create(
        randomUUID(),
        name,
        '#000000',
        [
			GroupPermission.create(
				randomUUID(), 
				PermissionName.ACCEPT_REQUESTS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.UPDATE_SETTINGS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.DELETE_GROUP
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.DELETE_POSTS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.DELETE_EVENTS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.CREATE_POSTS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.CREATE_EVENTS
			),
			GroupPermission.create(
				randomUUID(), 
				PermissionName.REMOVE_MEMBER
			)
		],
		isImmutable,
		null
    )
};

export const mockGroupMember = (isCreator = false): GroupMember => {
	return GroupMember.create(
		randomUUID(),
		mockGroup(),
		mockUser(),
		mockGroupRole(),
		isCreator
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
			GroupVisibility.PUBLIC
		)
	);
};

export const mockGroupMemberRequest = (): GroupMemberRequest => {
	return GroupMemberRequest.create(
		randomUUID(),
		mockGroup(),
		mockUser()
	);
};