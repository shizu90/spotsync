import { Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/cache/redis.service";
import { NotificationRepository, NotificationRepositoryProvider } from "src/notification/application/ports/out/notification.repository";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { User } from "src/user/domain/user.model";

@WebSocketGateway({
    namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    private logger: Logger;

    constructor(
        @Inject(RedisService)
        protected redisService: RedisService,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository,
    ) {
        this.logger = new Logger(NotificationGateway.name);
    }

    private async getAuthenticatedUserFromSocket(socket: Socket): Promise<User> {
        let token = socket.handshake.headers.authorization;

        if (!token) {
            return null;
        }

        token = token.split(' ')[1];

        const user_id = await this.redisService.get(token);
    
        const user = await this.userRepository.findById(user_id);

        return user;
    }

    afterInit(): void {
        this.logger.log(`Gateway initialized`);
    }

    async handleConnection(client: Socket) {
        const user = await this.getAuthenticatedUserFromSocket(client);

        if (!user) {
            client.disconnect();

            return;
        }

        this.redisService.subscribe(`notifications:${user.id()}`);

        this.redisService.on('message', async (channel, message) => {
            if (channel === `notifications:${user.id()}`) {
                const notification = await this.notificationRepository.findById(message);
            
                client.emit('notification', notification);
            }
        });

        this.logger.log(`Client listening to notifications: ${client.id}`);
        this.logger.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}