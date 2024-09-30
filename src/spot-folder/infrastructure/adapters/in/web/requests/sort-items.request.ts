import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

class SortItem {
	@ApiProperty({ required: true })
	@IsUUID(4)
	public spot_id: string;

	@ApiProperty({ required: true })
	@IsNumber()
	public order_number: number;
}

export class SortItemsRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SortItem)
	public spots: SortItem[];
}
