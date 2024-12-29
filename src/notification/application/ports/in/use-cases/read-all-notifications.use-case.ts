import { UseCase } from "src/common/core/common.use-case";
import { ReadAllNotificationsCommand } from "../commands/read-all-notifications.command";

export const ReadAllNotificationsUseCaseProvider = "ReadAllNotificationsUseCase";

export interface ReadAllNotificationsUseCase extends UseCase<ReadAllNotificationsCommand, Promise<void>> {}