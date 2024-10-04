import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
	@ApiProperty({ example: "/api/v1/users"})
	public path: string;
	@ApiProperty({ example: new Date().toISOString() })
	public timestamp: string;
	@ApiProperty()
	public message: string;
	@ApiProperty()
	public error_name: string;
	@ApiProperty({ required: false })
	public stack?: string;

	constructor(
		path: string,
		timestamp: string,
		message: string,
		error_name: string,
		stack?: string,
	) {
		this.path = path;
		this.timestamp = timestamp;
		this.message = message;
		this.error_name = error_name;
		this.stack = stack;
	}
}
