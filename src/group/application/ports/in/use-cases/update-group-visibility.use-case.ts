import { UseCase } from "src/common/common.use-case";
import { UpdateGroupVisibilityCommand } from "../commands/update-group-visibility.command";

export const UpdateGroupVisibilityUseCaseProvider = "UpdateGroupVisibilityUseCase";

export interface UpdateGroupVisibilityUseCase extends UseCase<UpdateGroupVisibilityCommand, Promise<void>> 
{}