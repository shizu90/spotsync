import { UseCase } from "src/common/common.use-case";
import { RemoveUserGroupMemberCommand } from "../commands/remove-user-group-member.command";

export const RemoveUserGroupMemberUseCaseProvider = "RemoveUserGroupMemberUseCase";

export interface RemoveUserGroupMemberUseCase extends UseCase<RemoveUserGroupMemberCommand, Promise<void>> 
{}