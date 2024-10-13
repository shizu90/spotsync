import { UseCase } from "src/common/core/common.use-case";
import { NotificationDto } from "../../out/dto/notification.dto";
import { CreateNotificationCommand } from "../commands/create-notification.command";

export const CreateNotificationUseCaseProvider = 'CreateNotificationUseCase';

export interface CreateNotificationUseCase extends UseCase<CreateNotificationCommand, Promise<NotificationDto>> {}