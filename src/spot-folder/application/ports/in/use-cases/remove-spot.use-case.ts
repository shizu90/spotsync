import { UseCase } from "src/common/core/common.use-case";
import { RemoveSpotCommand } from "../commands/remove-spot.command";

export const RemoveSpotUseCaseProvider = "RemoveSpotUseCase";

export interface RemoveSpotUseCase extends UseCase<RemoveSpotCommand, Promise<void>> {}