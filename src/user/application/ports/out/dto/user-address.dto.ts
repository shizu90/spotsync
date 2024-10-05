import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { UserAddress } from 'src/user/domain/user-address.model';

export class UserAddressDto extends Dto {
	@ApiPropertyOptional({ example: 'uuid' })
	public id: string = undefined;
	@ApiPropertyOptional()
	public name: string = undefined;
	@ApiPropertyOptional()
	public area: string = undefined;
	@ApiPropertyOptional()
	public sub_area: string = undefined;
	@ApiPropertyOptional()
	public locality: string = undefined;
	@ApiPropertyOptional()
	public country_code: string = undefined;
	@ApiPropertyOptional()
	public latitude: number = undefined;
	@ApiPropertyOptional()
	public longitude: number = undefined;
	@ApiPropertyOptional()
	public main: boolean = undefined;

	constructor(
		id: string,
		name: string,
		area: string,
		sub_area: string,
		locality: string,
		country_code: string,
		latitude: number,
		longitude: number,
		main: boolean,
	) {
		super();
		this.id = id;
		this.name = name;
		this.area = area;
		this.sub_area = sub_area;
		this.locality = locality;
		this.country_code = country_code;
		this.latitude = latitude;
		this.longitude = longitude;
		this.main = main;
	}

	public static fromModel(model: UserAddress): UserAddressDto {
		if (model === null || model === undefined) return null;

		return new UserAddressDto(
			model.id(),
			model.name(),
			model.area(),
			model.subArea(),
			model.locality(),
			model.countryCode(),
			model.latitude(),
			model.longitude(),
			model.main(),
		);
	}
}
