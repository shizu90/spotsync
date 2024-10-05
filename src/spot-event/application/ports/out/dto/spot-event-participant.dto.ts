import { ApiProperty } from "@nestjs/swagger";
import { Dto } from "src/common/core/common.dto";
import { SpotEventParticipant } from "src/spot-event/domain/spot-event-participant.model";
import { UserDto } from "src/user/application/ports/out/dto/user.dto";

export class SpotEventParticipantDto extends Dto {
    @ApiProperty()
    public user: UserDto = undefined;
    @ApiProperty({ example: new Date().toISOString() })
    public participated_at: string = undefined;

    private constructor(
        user?: UserDto,
        participated_at?: string
    ) {
        super();
        this.user = user;
        this.participated_at = participated_at;
    }

    public static fromModel(model: SpotEventParticipant): SpotEventParticipantDto {
        return new SpotEventParticipantDto(
            model.user() ? UserDto.fromModel(model.user()) : null,
            model.participatedAt()?.toISOString(),
        );
    }
}