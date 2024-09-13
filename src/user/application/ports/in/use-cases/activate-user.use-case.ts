import { UseCase } from "src/common/core/common.use-case";
import { ActivateUserCommand } from "../commands/activate-user.command";

export const ActivateUserUseCaseProvider = "ActivateUserUseCase";

export interface ActivateUserUseCase extends UseCase<ActivateUserCommand, void> {}