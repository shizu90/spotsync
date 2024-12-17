import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DefaultGroupRole } from 'src/group/domain/default-group-role.enum';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { FileStorage, FileStorageProvider } from 'src/storage/file-storage';
import { CreateGroupCommand } from '../ports/in/commands/create-group.command';
import { CreateGroupUseCase } from '../ports/in/use-cases/create-group.use-case';
import { GroupDto } from '../ports/out/dto/group.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../ports/out/group-role.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupRoleNotFoundError } from './errors/group-role-not-found.error';

@Injectable()
export class CreateGroupService implements CreateGroupUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(GroupRoleRepositoryProvider)
		protected groupRoleRepository: GroupRoleRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FileStorageProvider)
		protected fileStorage: FileStorage,
	) {}

	public async execute(command: CreateGroupCommand): Promise<GroupDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const adminRole = await this.groupRoleRepository.findByName(
			DefaultGroupRole.ADMINISTRATOR,
		);

		if (adminRole === null || adminRole === undefined) {
			throw new GroupRoleNotFoundError();
		}

		const groupId = randomUUID();

		const group = Group.create(
			groupId,
			command.name,
			command.about,
			null,
			null,
			GroupVisibilitySettings.create(
				groupId,
				GroupVisibility.PUBLIC,
				GroupVisibility.PUBLIC,
				GroupVisibility.PUBLIC,
			),
		);

		if (command.groupPicture) {
			const groupPic = command.groupPicture;

			const ext = groupPic.mimetype.split('/')[1];

			groupPic.filename = groupPic.originalname = `group-picture.${ext}`;

			const savedFile = await this.fileStorage.save(
				`groups/${group.id}`,
				groupPic,
			);

			group.changeGroupPicture(savedFile.path);
		}

		if (command.bannerPicture) {
			const bannerPic = command.bannerPicture;

			const ext = bannerPic.mimetype.split('/')[1];

			bannerPic.filename = bannerPic.originalname = `banner-picture.${ext}`;

			const savedFile = await this.fileStorage.save(
				`groups/${group.id}`,
				bannerPic,
			);

			group.changeBannerPicture(savedFile.path);
		}

		const creatorGroupMember = GroupMember.create(
			randomUUID(),
			group,
			authenticatedUser,
			adminRole,
			true,
			GroupMemberStatus.ACTIVE,
			new Date(),
			null,
		);

		await this.groupRepository.store(group);

		this.groupMemberRepository.store(creatorGroupMember);

		return GroupDto.fromModel(group);
	}
}
