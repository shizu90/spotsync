import { Dto } from "src/common/core/common.dto";
import { GroupDto } from "src/group/application/ports/out/dto/group.dto";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotDto } from "src/spot/application/ports/out/dto/spot.dto";
import { SpotEventParticipantDto } from "./spot-event-participant.dto";

export class SpotEventDto extends Dto {
    public id: string = undefined;
    public name: string = undefined;
    public description: string = undefined;
    public start_date: string = undefined;
    public end_date: string = undefined;
    public status: string = undefined;
    public visibility: string = undefined;
    public spot: SpotDto = undefined;
    public participants: SpotEventParticipantDto[] = undefined;
    public group: GroupDto = undefined;
    public created_at: string = undefined;
    public updated_at: string = undefined;

    private constructor(
        id?: string,
        name?: string,
        description?: string,
        start_date?: string,
        end_date?: string,
        status?: string,
        visibility?: string,
        spot?: SpotDto,
        participants?: SpotEventParticipantDto[],
        group?: GroupDto,
        created_at?: string,
        updated_at?: string
    ) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.visibility = visibility;
        this.spot = spot;
        this.participants = participants;
        this.group = group;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public static fromModel(model: SpotEvent): SpotEventDto {
        return new SpotEventDto(
            model.id(),
            model.name(),
            model.description(),
            model.startDate()?.toISOString(),
            model.endDate()?.toISOString(),
            model.status(),
            model.visibility(),
            model.spot() ? SpotDto.fromModel(model.spot()) : null,
            model.participants().map(p => SpotEventParticipantDto.fromModel(p)),
            model.group() ? GroupDto.fromModel(model.group()) : null,
            model.createdAt()?.toISOString(),
            model.updatedAt()?.toISOString(),
        );
    }
}