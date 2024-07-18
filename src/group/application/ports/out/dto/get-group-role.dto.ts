import { Dto } from 'src/common/common.dto';

export class GetGroupRoleDto extends Dto {
  constructor(
    readonly id: string,
    readonly group_id: string,
    readonly name: string,
    readonly is_immutable: boolean,
    readonly hex_color: string,
    readonly permissions: { id: string; name: string }[],
    readonly created_at: Date,
    readonly updated_at: Date,
  ) {
    super();
  }
}
