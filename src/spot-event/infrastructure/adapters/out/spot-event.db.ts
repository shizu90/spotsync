import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { SpotEventRepository } from "src/spot-event/application/ports/out/spot-event.repository";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";

@Injectable()
export class SpotEventRepositoryImpl implements SpotEventRepository {
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService,
    ) {}

    private _mountQuery(values: Object): Object {
        const spotId = values['spotId'];
        const groupId = values['groupId'];
        const status = values['status'];
        const startDate = values['startDate'];
        const endDate = values['endDate'];

        let query = {};

        if (spotId) {
            query['spot_id'] = spotId;
        }

        if (groupId) {
            query['group_id'] = groupId;
        }

        if (status) {
            query['status'] = status;
        }

        if (startDate) {
            query['start_date'] = {
                gte: startDate,
            };
        }

        if (endDate) {
            query['end_date'] = {
                lte: endDate,
            };
        }

        return query;
    }

    private _mountInclude(): Object {
        return {
            spot: true,
            participants: {
                include: {
                    user: {
                        include: {
                            profile: true,
                            visibility_settings: true,
                            credentials: true,
                        }
                    }
                }
            },
            group: {
                include: {
                    visibility_settings: true,
                }
            },
            creator: {
                include: {
                    profile: true,
                    visibility_settings: true,
                    credentials: true,
                }
            }
        };
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<SpotEvent>> {
        return null;
    }

    public async findBy(values: Object): Promise<Array<SpotEvent>> {
        return null;
    }

    public async countBy(values: Object): Promise<number> {
        return null;
    }

    public async findAll(): Promise<SpotEvent[]> {
        return null;
    }

    public async findById(id: string): Promise<SpotEvent> {
        return null;
    }

    public async store(spotEvent: SpotEvent): Promise<SpotEvent> {
        return null;
    }

    public async update(spotEvent: SpotEvent): Promise<void> {
        return null;
    }

    public async delete(id: string): Promise<void> {
        return null;
    }
}