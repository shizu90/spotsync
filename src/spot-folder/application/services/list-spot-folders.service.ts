import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { ListSpotFoldersCommand } from "../ports/in/commands/list-spot-folders.command";
import { ListSpotFoldersUseCase } from "../ports/in/use-cases/list-spot-folders.use-case";
import { GetSpotFolderDto } from "../ports/out/dto/get-spot-folder.dto";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";

@Injectable()
export class ListSpotFoldersService implements ListSpotFoldersUseCase {
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: ListSpotFoldersCommand): Promise<Pagination<GetSpotFolderDto> | Array<GetSpotFolderDto>> {
        const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

        const pagination = await this.spotFolderRepository.paginate({
            filters: {
                userId: command.creatorId,
                name: command.name,
            },
            limit: command.limit,
            page: command.page,
            sort: command.sort,
            sortDirection: command.sortDirection,
            paginate: command.paginate,
        });

        return null;
    }
}