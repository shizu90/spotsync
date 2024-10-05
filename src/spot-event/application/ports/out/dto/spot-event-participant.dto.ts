import { Dto } from "src/common/core/common.dto";
import { SpotEventParticipant } from "src/spot-event/domain/spot-event-participant.model";
import { UserDto } from "src/user/application/ports/out/dto/user.dto";

export class SpotEventParticipantDto extends Dto {
    public id: string = undefined;
    public user: UserDto = undefined;
    public participation_date: string = undefined;

    private constructor(
        user?: UserDto,
        participation_date?: string
    ) {
        super();
        this.user = user;
        this.participation_date = participation_date;
    }

    public static fromModel(model: SpotEventParticipant): SpotEventParticipantDto {
        return new SpotEventParticipantDto(
            model.user() ? UserDto.fromModel(model.user()) : null,
            model.participatedAt()?.toISOString(),
        );
    }
}