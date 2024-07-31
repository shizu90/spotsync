import { UseCase } from "src/common/common.use-case";
import { UnlikeCommand } from "../commands/unlike.command";

export const UnlikeUseCaseProvider = "UnlikeUseCase";

export interface UnlikeUseCase extends UseCase<UnlikeCommand, Promise<void>> 
{}