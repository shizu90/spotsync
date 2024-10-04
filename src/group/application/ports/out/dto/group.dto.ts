import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { GroupMember } from 'src/group/domain/group-member.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { GroupMemberDto } from './group-member.dto';

class GroupVisibilitySettingsDto extends Dto {
	@ApiProperty({ enum: GroupVisibility })
	public group: string = undefined;
	@ApiProperty({ enum: GroupVisibility })
	public posts: string = undefined;
	@ApiProperty({ enum: GroupVisibility })
	public spot_events: string = undefined;

	private constructor(group?: string, posts?: string, spot_events?: string) {
		super();
		this.group = group;
		this.posts = posts;
		this.spot_events = spot_events;
	}

	public static fromModel(
		model: GroupVisibilitySettings,
	): GroupVisibilitySettingsDto {
		return new GroupVisibilitySettingsDto(
			model.groups(),
			model.posts(),
			model.spotEvents(),
		);
	}
}

export class GroupDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public name: string = undefined;
	@ApiProperty()
	public about: string = undefined;
	@ApiProperty()
	public group_picture: string = undefined;
	@ApiProperty()
	public banner_picture: string = undefined;
	@ApiProperty()
	public visibility_settings: GroupVisibilitySettingsDto = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public updated_at: string = undefined;
	@ApiProperty()
	public is_member: boolean = undefined;
	@ApiProperty()
	public group_member: GroupMemberDto = undefined;

	private constructor(
		id?: string,
		name?: string,
		about?: string,
		group_picture?: string,
		banner_picture?: string,
		visibility_settings?: GroupVisibilitySettingsDto,
		created_at?: string,
		updated_at?: string,
		is_member?: boolean,
		group_member?: GroupMemberDto,
	) {
		super();
		this.id = id;
		this.name = name;
		this.about = about;
		this.group_picture = group_picture;
		this.banner_picture = banner_picture;
		this.visibility_settings = visibility_settings;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.is_member = is_member;
		this.group_member = group_member;
	}

	public static fromModel(model: Group): GroupDto {
		if (model === null || model === undefined) return null;

		return new GroupDto(
			model.id(),
			model.name(),
			model.about(),
			model.groupPicture(),
			model.bannerPicture(),
			GroupVisibilitySettingsDto.fromModel(model.visibilitySettings()),
			model.createdAt()?.toISOString(),
			model.updatedAt()?.toISOString(),
		);
	}

	public setGroupMember(groupMember: GroupMember): GroupDto {
		this.is_member = true;
		this.group_member = GroupMemberDto.fromModel(groupMember);

		return this;
	}
}
