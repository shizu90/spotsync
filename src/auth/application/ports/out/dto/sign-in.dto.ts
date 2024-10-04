import { Dto } from 'src/common/core/common.dto';

export class SignInDto extends Dto {
	public id: string = undefined;
	public name: string = undefined;
	public email: string = undefined;
	public bearer_token: string = undefined;

	constructor(
		id: string,
		name: string,
		email: string,
		bearer_token: string,
	) {
		super();

		this.id = id;
		this.name = name;
		this.email = email;
		this.bearer_token = bearer_token;
	}
}
