import { UseCase } from "src/common/common.use-case";
import { LeaveUserGroupCommand } from "../commands/leave-user-group.command";

export const LeaveUserGroupUseCaseProvider = "LeaveUserGroupUseCase";

export interface LeaveUserGroupUseCase extends UseCase<LeaveUserGroupCommand, Promise<void>> 
{}