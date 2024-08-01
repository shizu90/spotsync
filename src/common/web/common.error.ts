export class ErrorResponse {
	constructor(
		readonly path: string,
		readonly timestamp: string,
		readonly message: string,
	) {}
}
