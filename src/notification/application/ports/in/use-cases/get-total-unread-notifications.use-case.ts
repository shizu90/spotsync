import { UseCase } from "src/common/core/common.use-case";
import { GetTotalUnreadNotificationsCommand } from "../commands/get-total-unread-notifications.command";

export const GetTotalUnreadNotificationsUseCaseProvider = "GetTotalUnreadNotificationsUseCase";

export interface GetTotalUnreadNotificationsUseCase extends UseCase<GetTotalUnreadNotificationsCommand, Promise<number>> {}