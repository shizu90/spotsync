import { UseCase } from "src/common/core/common.use-case";
import { ReadNotificationCommand } from "../commands/read-notification.command";

export const ReadNotificationUseCaseProvider = "ReadNotificationUseCase";

export interface ReadNotificationUseCase extends UseCase<ReadNotificationCommand, Promise<void>> {}