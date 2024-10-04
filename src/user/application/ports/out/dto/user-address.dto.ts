import { ApiProperty } from '@nestjs/swagger';
import { Dto } from 'src/common/core/common.dto';
import { UserAddress } from 'src/user/domain/user-address.model';

export class UserAddressDto extends Dto {
	@ApiProperty({ example: 'uuid' })
	public id: string = undefined;
	@ApiProperty()
	public name: string = undefined;
	@ApiProperty()
	public area: string = undefined;
	@ApiProperty()
	public sub_area: string = undefined;
	@ApiProperty()
	public locality: string = undefined;
	@ApiProperty()
	public country_code: string = undefined;
	@ApiProperty()
	public latitude: number = undefined;
	@ApiProperty()
	public longitude: number = undefined;
	@ApiProperty()
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
