import { ApiPropertyOptional } from "@nestjs/swagger";
import { Dto } from "src/common/core/common.dto";
import { GroupDto } from "src/group/application/ports/out/dto/group.dto";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";
import { SpotEventVisibility } from "src/spot-event/domain/spot-event-visibility.enum";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotDto } from "src/spot/application/ports/out/dto/spot.dto";
import { SpotEventParticipantDto } from "./spot-event-participant.dto";

export class SpotEventDto extends Dto {
    @ApiPropertyOptional({ example: 'uuid' })
    public id: string = undefined;
    @ApiPropertyOptional()
    public name: string = undefined;
    @ApiPropertyOptional()
    public description: string = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public start_date: string = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public end_date: string = undefined;
    @ApiPropertyOptional({ enum: SpotEventStatus })
    public status: string = undefined;
    @ApiPropertyOptional({ enum: SpotEventVisibility })
    public visibility: string = undefined;
    @ApiPropertyOptional()
    public spot: SpotDto = undefined;
    @ApiPropertyOptional({ isArray: true, type: SpotEventParticipantDto })
    public participants: SpotEventParticipantDto[] = undefined;
    @ApiPropertyOptional()
    public group: GroupDto = undefined;
    @ApiPropertyOptional()
    public favorited?: boolean = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public favorited_at?: string = undefined;
    @ApiPropertyOptional()
    public total_favorites: number = undefined;
    @ApiPropertyOptional()
    public average_rating: number = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public created_at: string = undefined;
    @ApiPropertyOptional({ example: new Date().toISOString() })
    public updated_at: string = undefined;
    @ApiPropertyOptional()
    public notify_minutes: number = undefined;

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
        notify_minutes?: number,
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
        this.notify_minutes = notify_minutes;
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
            model.notifyMinutes(),
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

    public setAverageRating(average_rating: number): SpotEventDto {
        this.average_rating = average_rating;

        return this;
    }
}