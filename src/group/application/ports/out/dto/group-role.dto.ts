import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';

class GroupPermissionDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public name: string = undefined;

	private constructor(id?: string, name?: string) {
		super();
		this.id = id;
		this.name = name;
	}

	public static fromModel(model: GroupPermission): GroupPermissionDto {
		if (model === null || model === undefined) return null;

		return new GroupPermissionDto(model.id(), model.name());
	}
}

export class GroupRoleDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public name: string = undefined;
	@ApiProperty()
	public is_immutable: boolean = undefined;
	@ApiProperty()
	public hex_color: string = undefined;
	@ApiProperty({ type: [GroupPermissionDto], isArray: true })
	public permissions: GroupPermissionDto[] = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public created_at: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public updated_at: string = undefined;

	constructor(
		id?: string,
		name?: string,
		is_immutable?: boolean,
		hex_color?: string,
		permissions?: GroupPermissionDto[],
		created_at?: string,
		updated_at?: string,
	) {
		super();
		this.id = id;
		this.name = name;
		this.is_immutable = is_immutable;
		this.hex_color = hex_color;
		this.permissions = permissions;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	public static fromModel(model: GroupRole): GroupRoleDto {
		if (model === null || model === undefined) return null;

		return new GroupRoleDto(
			model.id(),
			model.name(),
			model.isImmutable(),
			model.hexColor(),
			model
				.permissions()
				.map((permission) => GroupPermissionDto.fromModel(permission)),
			model.createdAt()?.toISOString(),
			model.updatedAt()?.toISOString(),
		);
	}
}
