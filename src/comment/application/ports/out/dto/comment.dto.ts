import { CommentSubject } from "src/comment/domain/comment-subject.model.";
import { Comment } from "src/comment/domain/comment.model";
import { Dto } from "src/common/core/common.dto";
import { SpotDto } from "src/spot/application/ports/out/dto/spot.dto";
import { Spot } from "src/spot/domain/spot.model";
import { UserDto } from "src/user/application/ports/out/dto/user.dto";

type CommentableDto = SpotDto;

export class CommentDto extends Dto {
    public id: string = undefined;
    public text: string = undefined;
    public user: UserDto = undefined;
    public commentable: CommentableDto = undefined;
    public created_at: string = undefined;

    private constructor(
        id: string,
        text: string,
        user: UserDto,
        commentable: CommentableDto,
        created_at: string
    ) {
        super();
        this.id = id;
        this.text = text;
        this.user = user;
        this.commentable = commentable;
        this.created_at = created_at;
    }

    public static fromModel(model: Comment): CommentDto {
        if (model === null || model === undefined) return null;

        let commentable: CommentableDto = null;

        if (model.subject() === CommentSubject.SPOT) {
            commentable = SpotDto.fromModel(model.commentable() as Spot);
        }
        
        return new CommentDto(
            model.id(),
            model.text(),
            model.user() ? UserDto.fromModel(model.user()) : undefined,
            commentable,
            model.createdAt()?.toISOString()
        );
    }
}