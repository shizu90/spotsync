import { ApiProperty } from "@nestjs/swagger";
import { Dto } from "src/common/core/common.dto";
import { GroupDto } from "src/group/application/ports/out/dto/group.dto";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";
import { SpotEventVisibility } from "src/spot-event/domain/spot-event-visibility.enum";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotDto } from "src/spot/application/ports/out/dto/spot.dto";
import { SpotEventParticipantDto } from "./spot-event-participant.dto";

export class SpotEventDto extends Dto {
    @ApiProperty({ example: 'uuid' })
    public id: string = undefined;
    @ApiProperty()
    public name: string = undefined;
    @ApiProperty()
    public description: string = undefined;
    @ApiProperty({ example: new Date().toISOString() })
    public start_date: string = undefined;
    @ApiProperty({ example: new Date().toISOString() })
    public end_date: string = undefined;
    @ApiProperty({ enum: SpotEventStatus })
    public status: string = undefined;
    @ApiProperty({ enum: SpotEventVisibility })
    public visibility: string = undefined;
    @ApiProperty()
    public spot: SpotDto = undefined;
    @ApiProperty({ isArray: true, type: SpotEventParticipantDto })
    public participants: SpotEventParticipantDto[] = undefined;
    @ApiProperty()
    public group: GroupDto = undefined;
    @ApiProperty()
    public favorited?: boolean = undefined;
    @ApiProperty({ example: new Date().toISOString() })
    public favorited_at?: string = undefined;
    @ApiProperty()
    public total_favorites: number = undefined;
    @ApiProperty({ example: new Date().toISOString() })
    public created_at: string = undefined;
    @ApiProperty({ example: new Date().toISOString() })
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
        updated_at?: string,
        favorited?: boolean,
        favorited_at?: string,
        total_favorites?: number,
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
        this.favorited = favorited;
        this.favorited_at = favorited_at;
        this.total_favorites = total_favorites;
    }

    public static fromModel(model: SpotEvent): SpotEventDto {
        if (!model) return null;
        
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
            false,
            null,
            0,
        );
    }

    public setFavoritedAt(favorited_at: Date): SpotEventDto {
        this.favorited_at = favorited_at?.toISOString();
        this.favorited = favorited_at ? true : false;

        return this;
    }

    public setTotalFavorites(total_favorites: number): SpotEventDto {
        this.total_favorites = total_favorites;

        return this;
    }
}