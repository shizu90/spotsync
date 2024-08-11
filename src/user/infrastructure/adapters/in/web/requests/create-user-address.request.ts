import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiRequest } from 'src/common/web/common.request';

export class CreateUserAddressRequest extends ApiRequest {
	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(255)
	@MinLength(3)
	public name: string;

	@ApiProperty({ required: true })
	@IsString()
	public area: string;

	@ApiProperty({ required: true })
	@IsString()
	public sub_area: string;

	@ApiProperty({ required: true })
	@IsString()
	public locality: string;

	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(2)
	@MinLength(2)
	public country_code: string;

	@ApiProperty({ required: true })
	@IsBoolean()
	public main: boolean;
}
