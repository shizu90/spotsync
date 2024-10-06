import { Repository } from "src/common/core/common.repository";
import { Notification } from "src/notification/domain/notification.model";

export const NotificationRepositoryProvider = "NotificationRepository";

export interface NotificationRepository extends Repository<Notification, string> {}