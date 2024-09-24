import { Controller } from "@nestjs/common";
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ApiController } from "src/common/web/common.controller";
import { ErrorResponse } from "src/common/web/common.error";

@ApiTags("Favorites")
@ApiUnauthorizedResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@ApiInternalServerErrorResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@ApiForbiddenResponse({
	example: new ErrorResponse(
		'string',
		'2024-07-24 12:00:00',
		'string',
		'string',
	),
})
@Controller("favorites")
export class FavoriteController extends ApiController {

}