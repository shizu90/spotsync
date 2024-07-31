import { Dto } from 'src/common/common.dto';

export class LikeDto extends Dto {
	constructor(
		readonly id: string,
		readonly subject: string,
		readonly subject_id: string,
	) {
		super();
	}
}
