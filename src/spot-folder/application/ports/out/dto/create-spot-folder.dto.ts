import { Dto } from "src/common/core/common.dto";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";

export class CreateSpotFolderDto extends Dto 
{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly hex_color: string,
        readonly visibility: SpotFolderVisibility,
        readonly items: {spot_id: string}[],
        readonly creator_id: string,
        readonly created_at: Date,
        readonly updated_at: Date,
    ) 
    {super();}
}