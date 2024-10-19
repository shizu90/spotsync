import { Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { TokenService } from "src/auth/infrastructure/adapters/in/web/handlers/token.service";
import { RedisService } from "src/cache/redis.service";
import { NotificationDto } from "src/notification/application/ports/out/dto/notification.dto";
import { NotificationRepository, NotificationRepositoryProvider } from "src/notification/application/ports/out/notification.repository";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { User } from "src/user/domain/user.model";

@WebSocketGateway({
    namespace: 'ws/notifications',
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    private logger: Logger;

    constructor(
        @Inject(RedisService)
        protected redisService: RedisService,
        @Inject(TokenService)
        protected tokenService: TokenService,
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

        const payload = await this.tokenService.verifyToken<{sub: string, name: string}>(token);

        if (!payload) return null;
    
        const user = await this.userRepository.findById(payload.sub);

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

        const subscriberClient = new RedisService();

        const channel = `notifications:${user.id()}`;

        await subscriberClient.subscribe(channel);

        subscriberClient.on('message', async (ch, m) => {
            if (ch == channel) {
                const notification = await this.notificationRepository.findById(m);

                client.emit('notification', NotificationDto.fromModel(notification));
            }
        });

        this.logger.log(`Client listening to notifications: ${client.id}`);
        this.logger.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}