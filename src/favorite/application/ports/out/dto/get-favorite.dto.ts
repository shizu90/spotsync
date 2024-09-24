import { Dto } from "src/common/core/common.dto";

export class GetFavoriteDto extends Dto {
    constructor(
        readonly id: string,
        readonly spot: {
            id: string,
            name: string,
            description: string,
            type: string,
            photos: { id: string, file_path: string }[],
            address: {
                area: string,
                sub_area: string,
                locality: string,
                country_code: string,
                latitude: number,
                longitude: number,
            },
            creator: {
                id: string,
                display_name: string,
                profile_picture: string,
                credentials: {
                    name: string
                }
            }
        } = undefined,
        readonly spot_folder: {
            id: string,
            name: string,
            description: string,
            items: {
                spot: {
                    id: string,
                    name: string,
                    description: string,
                    type: string,
                    photos: { id: string, file_path: string }[],
                    address: {
                        area: string,
                        sub_area: string,
                        locality: string,
                        country_code: string,
                        latitude: number,
                        longitude: number,
                    },
                    creator: {
                        id: string,
                        display_name: string,
                        profile_picture: string,
                        credentials: {
                            name: string
                        }
                    }
                },
                added_at: Date,
                order_number: number,
            }[],
            creator: {
                id: string,
                display_name: string,
                profile_picture: string,
                credentials: {
                    name: string
                }
            },
            created_at: string,
            updated_at: string,
        } = undefined,
        readonly spot_event = undefined,
    ) {
        super();
    }
}