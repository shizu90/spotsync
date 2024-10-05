import { UseCase } from "src/common/core/common.use-case";
import { SpotEventDto } from "../../out/dto/spot-event.dto";
import { GetSpotEventCommand } from "../commands/get-spot-event.command";

export const GetSpotEventUseCaseProvider = "GetSpotEventUseCase";

export interface GetSpotEventUseCase extends UseCase<GetSpotEventCommand, Promise<SpotEventDto>> {}