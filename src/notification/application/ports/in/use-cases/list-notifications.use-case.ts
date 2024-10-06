import { Pagination } from "src/common/core/common.repository";
import { UseCase } from "src/common/core/common.use-case";
import { NotificationDto } from "../../out/dto/notification.dto";
import { ListNotificationsCommand } from "../commands/list-notifications.command";

export const ListNotificationsUseCaseProvider = "ListNotificationsUseCase";

export interface ListNotificationsUseCase extends UseCase<ListNotificationsCommand, Promise<Pagination<NotificationDto> | Array<NotificationDto>>> {}