import { Dto } from "src/common/core/common.dto";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";

export class GetSpotFolderDto extends Dto {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly hex_color: string,
        readonly visibility: SpotFolderVisibility,
        readonly items: {
            spot: {
                id: string,
                name: string,
                description: string,
                address: {
                    area: string,
                    sub_area: string,
                    country_code: string,
                    locality: string,
                    latitude: number,
                    longitude: number,
                },
                type: string,
                photos: {
                    id: string,
                    file_path: string,
                }[],
                creator: {
                    id: string,
                    display_name: string,
                    profile_picture: string,
                    credentials: {
                        name: string,
                    }
                },
            },
            added_at: Date,
            order_number: number
        }[],
        readonly creator: {
            id: string,
            display_name: string,
            profile_picture: string,
            credentials: {
                name: string,
            }
        },
        readonly created_at: Date,
        readonly updated_at: Date,
    ) {super();}
}