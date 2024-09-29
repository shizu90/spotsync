import { Inject, Injectable } from "@nestjs/common";
import { Pagination } from "src/common/core/common.repository";
import { ListCommentsCommand } from "../ports/in/commands/list-comments.command";
import { ListCommentsUseCase } from "../ports/in/use-cases/list-comments.use-case";
import { CommentRepository, CommentRepositoryProvider } from "../ports/out/comment.repository";
import { CommentDto } from "../ports/out/dto/comment.dto";

@Injectable()
export class ListCommentsService implements ListCommentsUseCase {
    constructor(
        @Inject(CommentRepositoryProvider)
        protected commentRepository: CommentRepository,
    ) {}

    public async execute(command: ListCommentsCommand): Promise<Pagination<CommentDto> | Array<CommentDto>> {
        const comments = await this.commentRepository.paginate({
            filters: {
                subject: command.subject,
                subjectId: command.subjectId,
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            page: command.page,
            limit: command.limit,
            paginate: command.paginate,
        });

        const items = comments.items.map(comment => CommentDto.fromModel(comment));

        if (command.paginate) {
            return new Pagination(items, comments.total, comments.current_page, comments.limit);
        } else {
            return items;
        }
    }
}