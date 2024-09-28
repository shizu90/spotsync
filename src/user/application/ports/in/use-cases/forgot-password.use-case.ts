import { UseCase } from "src/common/core/common.use-case";
import { PasswordRecoveryDto } from "../../out/dto/password-recovery.dto";
import { ForgotPasswordCommand } from "../commands/forgot-password.command";

export const ForgotPasswordUseCaseProvider = "ForgotPasswordUseCase";

export interface ForgotPasswordUseCase extends UseCase<ForgotPasswordCommand, Promise<PasswordRecoveryDto>> {}