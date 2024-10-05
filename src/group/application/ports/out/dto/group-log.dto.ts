import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { GroupLog } from 'src/group/domain/group-log.model';

export class GroupLogDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public text: string = undefined;
	@ApiPropertyOptional({ example: new Date().toISOString() })
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
