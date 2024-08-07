import { UseCase } from "src/common/core/common.use-case";
import { GetSpotDto } from "../../out/dto/get-spot.dto";
import { GetSpotCommand } from "../commands/get-spot.command";

export const GetSpotUseCaseProvider = "GetSpotUseCase";

export interface GetSpotUseCase extends UseCase<GetSpotCommand, Promise<GetSpotDto>> {}