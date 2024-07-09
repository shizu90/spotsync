import { UseCase } from "src/common/common.use-case";
import { AcceptUserGroupRequestCommand } from "../commands/accept-user-group-request.command";
import { AcceptUserGroupRequestDto } from "../../out/dto/accept-user-group-request.dto";

export const AcceptUserGroupRequestUseCaseProvider = "AcceptUserGroupRequestUseCase";

export interface AcceptUserGroupRequestUseCase extends UseCase<AcceptUserGroupRequestCommand, Promise<AcceptUserGroupRequestDto>> 
{}