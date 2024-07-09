import { UseCase } from "src/common/common.use-case";
import { JoinUserGroupCommand } from "../commands/join-user-group.command";
import { JoinUserGroupDto } from "../../out/dto/join-user-group.dto";
import { AcceptUserGroupRequestDto } from "../../out/dto/accept-user-group-request.dto";

export const JoinUserGroupUseCaseProvider = "JoinUserGroupUseCase";

export interface JoinUserGroupUseCase extends UseCase<JoinUserGroupCommand, Promise<JoinUserGroupDto | AcceptUserGroupRequestDto>> 
{}