import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { FileStorage, FileStorageProvider } from 'src/storage/file-storage';
import { UpdateGroupCommand } from '../ports/in/commands/update-group.command';
import { UpdateGroupUseCase } from '../ports/in/use-cases/update-group.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../ports/out/group.repository';
import { GroupNotFoundError } from './errors/group-not-found.error';

@Injectable()
export class UpdateGroupService implements UpdateGroupUseCase {
	constructor(
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupMemberRepositoryProvider)
		protected groupMemberRepository: GroupMemberRepository,
		@Inject(FileStorageProvider)
		protected fileStorage: FileStorage,
	) {}

	public async execute(command: UpdateGroupCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const group = await this.groupRepository.findById(command.id);

		if (group === null || group === undefined || group.isDeleted()) {
			throw new GroupNotFoundError();
		}

		const authenticatedGroupMember = (
			await this.groupMemberRepository.findBy({
				groupId: group.id(),
				userId: authenticatedUser.id(),
				status: GroupMemberStatus.ACTIVE,
			})
		).at(0);

		if (
			authenticatedGroupMember === null ||
			authenticatedGroupMember === undefined
		) {
			throw new UnauthorizedAccessError();
		}

		if (
			!authenticatedGroupMember.canExecute(
				GroupPermissionName.UPDATE_SETTINGS,
			)
		) {
			throw new UnauthorizedAccessError();
		}

		if (command.name && command.name !== null && command.name.length > 0) {
			group.changeName(command.name);
		}

		if (
			command.about &&
			command.about !== null &&
			command.about.length > 0
		) {
			group.changeAbout(command.about);
		}

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

			bannerPic.filename = `banner-picture.${ext}`;

			const savedFile = await this.fileStorage.save(
				`groups/${group.id}`,
				bannerPic,
			);

			group.changeBannerPicture(savedFile.path);
		}

		this.groupRepository.update(group);

		const log = group.newLog(
			`${authenticatedGroupMember.user().credentials().name()} updated the group settings.`,
		);

		this.groupRepository.storeLog(log);
	}
}
