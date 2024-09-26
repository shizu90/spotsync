import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnfavoriteCommand } from "../ports/in/commands/unfavorite.command";
import { UnfavoriteUseCase } from "../ports/in/use-cases/unfavorite.use-case";
import { FavoriteRepository, FavoriteRepositoryProvider } from "../ports/out/favorite.repository";
import { FavoriteNotFoundError } from "./errors/favorite-not-found.error";

@Injectable()
export class UnfavoriteService implements UnfavoriteUseCase {
    constructor(
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) {}

    public async execute(command: UnfavoriteCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const favorite = (
            await this.favoriteRepository.findBy({
                subject: command.subject,
                subjectId: command.subjectId,
                userId: authenticatedUser.id(),
            })
        ).at(0);

        if (favorite === null || favorite === undefined) {
            throw new FavoriteNotFoundError();
        }

        await this.favoriteRepository.delete(favorite.id());
    }
}