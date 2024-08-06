import { Dto } from 'src/common/core/common.dto';

export class CreateGroupRoleDto extends Dto {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly hex_color: string,
		readonly permissions: { id: string; name: string }[],
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly is_immutable: boolean,
	) {
		super();
	}
}
