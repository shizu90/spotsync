import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class TokenService {
    constructor(
        @Inject(JwtService)
        protected jwtService: JwtService
    ) {}

    public async generateToken<P extends Object>(payload: P): Promise<string> {
        return await this.jwtService.signAsync(payload);
    }

    public async verifyToken<P extends Object>(token: string): Promise<P> {
        return await this.jwtService.verifyAsync(token);
    }
}