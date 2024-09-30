import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsHexColor,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';

export class UpdateSpotFolderRequest extends ApiRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	public name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MaxLength(400)
	public description?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsHexColor()
	public hex_color?: string;

	@ApiProperty({ required: false, enum: SpotFolderVisibility })
	@IsOptional()
	@IsEnum(SpotFolderVisibility)
	public visibility?: SpotFolderVisibility;
}
