import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { AuthGuard } from "src/auth/infrastructure/adapters/in/web/handlers/auth.guard";
import { RedisService } from "src/cache/redis.service";

@Injectable()
@UseGuards(AuthGuard)
@WebSocketGateway({ path: '/api/v1/notifications' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(RedisService)
        protected redisService: RedisService,
    ) {}
    
    public async handleConnection(client: Socket, ...args: any[]): Promise<void> {
        const user = await this.getAuthenticatedUser.execute(null);
        
        if (!user) {
            client.disconnect();
            return;
        }

        this.redisService.subscribe('notifications:' + user.id());
        this.redisService.on('message', (channel, message) => {
            client.emit('notification', message); 
        });
    }

    public async handleDisconnect(client: any): Promise<void> {
        const user = await this.getAuthenticatedUser.execute(null);

        if (!user) {
            return;
        }

        this.redisService.unsubscribe('notifications:' + user.id());
        this.redisService.quit();
    }
}