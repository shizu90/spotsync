import { UseCase } from "src/common/core/common.use-case";
import { VisitSpotCommand } from "../commands/visit-spot.command";

export const VisitSpotUseCaseProvider = "VisitSpotUseCaseProvider";

export interface VisitSpotUseCase extends UseCase<VisitSpotCommand, Promise<void>> {}