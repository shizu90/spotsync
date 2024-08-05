import { UseCase } from "src/common/common.use-case";
import { UpdateSpotCommand } from "../commands/update-spot.command";

export interface UpdateSpotUseCase extends UseCase<UpdateSpotCommand, Promise<void>> {}