import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { GroupLog } from 'src/group/domain/group-log.model';

export class GroupLogDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public text: string = undefined;
	@ApiProperty({ example: new Date().toISOString() })
	public occurred_at: string = undefined;

	private constructor(id: string, text: string, occurred_at: string) {
		super();
		this.id = id;
		this.text = text;
		this.occurred_at = occurred_at;
	}

	public static fromModel(model: GroupLog): GroupLogDto {
		if (model === null || model === undefined) return null;

		return new GroupLogDto(
			model.id(),
			model.text(),
			model.occurredAt()?.toISOString(),
		);
	}
}
