import { Dto } from "src/common/core/common.dto";
import { SpotFolderItem } from "src/spot-folder/domain/spot-folder-item.model";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotDto } from "src/spot/application/ports/out/dto/spot.dto";

class SpotFolderItemDto extends Dto {
    public spot: SpotDto = undefined;
    public order_number: number = undefined;
    public added_at: string = undefined;

    private constructor(
        spot?: SpotDto,
        order_number?: number,
        added_at?: string,
    ) {
        super();
        this.spot = spot;
        this.order_number = order_number;
        this.added_at = added_at;
    }

    public static fromModel(model: SpotFolderItem): SpotFolderItemDto {
        return new SpotFolderItemDto(
            SpotDto.fromModel(model.spot()),
            model.orderNumber(),
            model.addedAt()?.toISOString(),
        );
    }
}

export class SpotFolderDto extends Dto {
    public id: string = undefined;
    public name: string = undefined;
    public description: string = undefined;
    public hex_color: string = undefined;
    public visibility: string = undefined;
    public items: SpotFolderItemDto[] = undefined;

    private constructor(
        id?: string,
        name?: string,
        description?: string,
        hex_color?: string,
        visibility?: string,
        items?: SpotFolderItemDto[],
    ) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.hex_color = hex_color;
        this.visibility = visibility;
        this.items = items;
    }

    public static fromModel(model: SpotFolder): SpotFolderDto {
        return new SpotFolderDto(
            model.id(),
            model.name(),
            model.description(),
            model.hexColor(),
            model.visibility(),
            model.items().map((item) => SpotFolderItemDto.fromModel(item)),
        );
    }
}