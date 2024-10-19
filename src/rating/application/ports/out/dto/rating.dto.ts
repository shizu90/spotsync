import { ApiPropertyOptional } from "@nestjs/swagger";
import { Dto } from "src/common/core/common.dto";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";
import { Rating } from "src/rating/domain/rating.model";
import { UserDto } from "src/user/application/ports/out/dto/user.dto";

export class RatingDto extends Dto {
    @ApiPropertyOptional({ example: 'uuid' })
    public id: string;
    @ApiPropertyOptional()
    public value: number;
    @ApiPropertyOptional()
    public comment: string;
    @ApiPropertyOptional()
    public user: UserDto;
    @ApiPropertyOptional()
    public subject: RatableSubject;
    @ApiPropertyOptional()
    public subject_id: string;
    @ApiPropertyOptional()
    public created_at: string;
    @ApiPropertyOptional()
    public updated_at: string;

    private constructor(
        id: string = undefined,
        value: number = undefined,
        comment: string = undefined,
        user: UserDto = undefined,
        subject: RatableSubject = undefined,
        subject_id: string = undefined,
        created_at: string = undefined,
        updated_at: string = undefined
    ) {
        super();
        this.id = id;
        this.value = value;
        this.comment = comment;
        this.user = user;
        this.subject = subject;
        this.subject_id = subject_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public static fromModel(model: Rating): RatingDto {
        return new RatingDto(
            model.id(),
            model.value(),
            model.comment(),
            UserDto.fromModel(model.user()),
            model.subject(),
            model.subjectId(),
            model.createdAt()?.toISOString(),
            model.updatedAt()?.toISOString(),
        );
    }
}