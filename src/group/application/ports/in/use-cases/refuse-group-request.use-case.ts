import { UseCase } from "src/common/common.use-case";
import { RefuseGroupRequestCommand } from "../commands/refuse-group-request.command";

export const RefuseGroupRequestUseCaseProvider = "RefuseGroupRequestUseCase";

export interface RefuseGroupRequestUseCase extends UseCase<RefuseGroupRequestCommand, Promise<void>> 
{}