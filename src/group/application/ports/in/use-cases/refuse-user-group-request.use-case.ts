import { UseCase } from "src/common/common.use-case";
import { RefuseUserGroupRequestCommand } from "../commands/refuse-user-group-request.command";

export const RefuseUserGroupRequestUseCaseProvider = "RefuseUserGroupRequestUseCase";

export interface RefuseUserGroupRequestUseCase extends UseCase<RefuseUserGroupRequestCommand, Promise<void>> 
{}