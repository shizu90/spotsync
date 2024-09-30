import { Dto } from 'src/common/core/common.dto';
import { UserAddress } from 'src/user/domain/user-address.model';

export class UserAddressDto extends Dto {
	public name: string = undefined;
	public area: string = undefined;
	public sub_area: string = undefined;
	public locality: string = undefined;
	public country_code: string = undefined;
	public latitude: number = undefined;
	public longitude: number = undefined;
	public main: boolean = undefined;

	constructor(
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
