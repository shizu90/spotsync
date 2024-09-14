import { UseCase } from "src/common/core/common.use-case";
import { ForgotPasswordDto } from "../../out/dto/forgot-password.dto";
import { ForgotPasswordCommand } from "../commands/forgot-password.command";

export const ForgotPasswordUseCaseProvider = "ForgotPasswordUseCase";

export interface ForgotPasswordUseCase extends UseCase<ForgotPasswordCommand, Promise<ForgotPasswordDto>> {}