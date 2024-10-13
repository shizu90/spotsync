import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { ListNotificationsCommand } from "../ports/in/commands/list-notifications.command";
import { ListNotificationsUseCase } from "../ports/in/use-cases/list-notifications.use-case";
import { NotificationDto } from "../ports/out/dto/notification.dto";
import { NotificationRepository, NotificationRepositoryProvider } from "../ports/out/notification.repository";

@Injectable()
export class ListNotificationsService implements ListNotificationsUseCase {
    constructor(
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: ListNotificationsCommand): Promise<Pagination<NotificationDto> | Array<NotificationDto>> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const notifications = await this.notificationRepository.paginate({
            filters: {
                status: command.status,
                type: command.type,
                userId: authenticatedUser.id(),
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            limit: command.limit,
            page: command.page,
            paginate: command.paginate,
        });

        const items = notifications.items.map(n => {
            return NotificationDto.fromModel(n);
        });

        if (command.paginate) {
            return new Pagination(
                items,
                notifications.total,
                notifications.current_page,
                notifications.limit,
            );
        } else {
            return items;
        }
    }
}