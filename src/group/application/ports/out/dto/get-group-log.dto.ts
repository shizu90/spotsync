import { Dto } from 'src/common/common.dto';

export class GetGroupLogDto extends Dto {
	constructor(
		readonly id: string,
		readonly text: string,
		readonly group_id: string,
		readonly occurred_at: Date,
	) {
		super();
	}
}
