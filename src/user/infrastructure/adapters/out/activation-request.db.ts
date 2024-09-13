import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivationRequestRepository } from "src/user/application/ports/out/activation-request.repository";
import { ActivationRequest } from "src/user/domain/activation-request.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { User } from "src/user/domain/user.model";

@Injectable()
export class ActivationRequestRepositoryImpl implements ActivationRequestRepository {
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

    private mapActivationRequestToDomain(prisma_model: any): ActivationRequest | null {
        if (prisma_model == null || prisma_model == undefined) return null;

        return ActivationRequest.create(
            prisma_model.id,
            User.create(
                prisma_model.user.id,
                prisma_model.user.first_name,
                prisma_model.user.last_name,
                prisma_model.user.profile_theme_color,
                prisma_model.user.profile_picture,
                prisma_model.user.banner_picture,
                prisma_model.user.biograph,
                prisma_model.user.birth_date,
                UserCredentials.create(
                    prisma_model.user.id,
                    prisma_model.user.credentials.name,
                    prisma_model.user.credentials.email,
                    prisma_model.user.credentials.password,
                    prisma_model.user.credentials.phone_number,
                    prisma_model.user.credentials.last_login,
                    prisma_model.user.credentials.last_logout,
                ),
                UserVisibilityConfig.create(
                    prisma_model.user.id,
                    prisma_model.user.visibility_configuration.profile,
					prisma_model.user.visibility_configuration.addresses,
					prisma_model.user.visibility_configuration.spot_folders,
					prisma_model.user.visibility_configuration.visited_spots,
					prisma_model.user.visibility_configuration.posts,
					prisma_model.user.visibility_configuration.favorite_spots,
					prisma_model.user.visibility_configuration
						.favorite_spot_folders,
					prisma_model.user.visibility_configuration
						.favorite_spot_events,
                ),
                prisma_model.user.status,
                prisma_model.user.created_at,
                prisma_model.user.updated_at,
                prisma_model.user.is_deleted
            ),
            prisma_model.subject,
            prisma_model.code,
            prisma_model.status,
            prisma_model.requested_at
        )
    }

    public async paginate(params: PaginateParameters): Promise<Pagination<ActivationRequest>> {
        let query = 
            `SELECT * FROM activation_requests`;

        if (params.filters) {
            if (typeof params.filters['status'] === 'string') {
                const status = params.filters['status'];
                if (query.includes('WHERE')) {
                    query = `${query} AND status = '${status}'`;
                } else {
                    query = `${query} WHERE status = '${status}'`;
                }
            }

            if (typeof params.filters['subject'] === 'string') {
                const subject = params.filters['subject'];
                if (query.includes('WHERE')) {
                    query = `${query} AND subject = '${subject}'`;
                } else {
                    query = `${query} WHERE subject = '${subject}'`;
                }
            }

            if (typeof params.filters['userId'] === 'string') {
                const userId = params.filters['userId'];
                if (query.includes('WHERE')) {
                    query = `${query} AND user_id = '${userId}'`;
                } else {
                    query = `${query} WHERE user_id = '${userId}'`;
                }
            }
        }

        const ids = 
            await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);
        
        const sort = params.sort ?? 'requested_at';
        const sortDirection = params.sortDirection ?? SortDirection.DESC;

        let orderBy = {};

        switch (sort) {
            case 'requestedAt':
            case 'requested_at':
            default:
                orderBy = { requested_at: sortDirection };
                break;
        }

        let items = [];

        const paginate = params.paginate ?? false;
        const page = params.page ?? 0;
        const limit = params.limit ?? 12;
        const total = ids.length;

        if (paginate) {
            items = await this.prismaService.activationRequest.findMany({
                where: {id: {in: ids.map(row => row.id)}},
                orderBy: orderBy,
                include: {
                    user: {
                        include: {
                            credentials: true,
                            visibility_configuration: true
                        }
                    }
                },
                skip: limit * page,
                take: limit
            });
        } else {
            items = await this.prismaService.user.findMany({
                where: {id: {in: ids.map(row => row.id)}},
                orderBy: orderBy,
                include: {
                    credentials: true,
                    visibility_configuration: true
                }
            });
        }

        items = items.map((i) => {
            return this.mapActivationRequestToDomain(i);
        });

        return new Pagination(items, total, page, limit);
    }
    
    public async findBy(values: Object): Promise<ActivationRequest[]> {
        const status = values['status'];
        const subject = values['subject'];
        const code = values['code'];
        const userId = values['userId'];

        let query = 
            `SELECT activation_requests.id FROM activation_requests`;

        if (status) {
            if (query.includes('WHERE')) {
                query = `${query} AND status = '${status}'`;
            } else {
                query = `${query} WHERE status = '${status}'`;
            }
        }

        if (subject) {
            if (query.includes('WHERE')) {
                query = `${query} AND subject = '${subject}'`;
            } else {
                query = `${query} WHERE subject = '${subject}'`;
            }
        }

        if (code) {
            if (query.includes('WHERE')) {
                query = `${query} AND code = '${code}'`;
            } else {
                query = `${query} WHERE code = '${code}'`;
            }
        }

        if (userId) {
            if (query.includes('WHERE')) {
                query = `${query} AND user_id = '${userId}'`;
            } else {
                query = `${query} WHERE user_id = '${userId}'`;
            }
        }

        const ids = 
            await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);
        
        const items = await this.prismaService.activationRequest.findMany({
            where: {id: {in: ids.map(row => row.id)}},
            include: {
                user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                }
            }
        });

        return items.map((i) => {
            return this.mapActivationRequestToDomain(i);
        });
    }
    public async countBy(values: Object): Promise<number> {
        const status = values['status'];
        const subject = values['subject'];
        const code = values['code'];
        const userId = values['userId'];

        let query = 
            `SELECT COUNT(activation_requests.id) FROM activation_requests`;

        if (status) {
            if (query.includes('WHERE')) {
                query = `${query} AND status = '${status}'`;
            } else {
                query = `${query} WHERE status = '${status}'`;
            }
        }

        if (subject) {
            if (query.includes('WHERE')) {
                query = `${query} AND subject = '${subject}'`;
            } else {
                query = `${query} WHERE subject = '${subject}'`;
            }
        }

        if (code) {
            if (query.includes('WHERE')) {
                query = `${query} AND code = '${code}'`;
            } else {
                query = `${query} WHERE code = '${code}'`;
            }
        }

        if (userId) {
            if (query.includes('WHERE')) {
                query = `${query} AND user_id = '${userId}'`;
            } else {
                query = `${query} WHERE user_id = '${userId}'`;
            }
        }

        const count = 
            await this.prismaService.$queryRawUnsafe<{ count: number }>(query);

        return count.count;
    }

    public async findById(id: string): Promise<ActivationRequest> {
        const item = await this.prismaService.activationRequest.findFirst({
            where: {id: id},
            include: {
                user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                }
            }
        });

        return this.mapActivationRequestToDomain(item);
    }

    public async findAll(): Promise<ActivationRequest[]> {
        const items = await this.prismaService.activationRequest.findMany({
            include: {
                user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                }
            }
        });

        return items.map((i) => {
            return this.mapActivationRequestToDomain(i);
        });
    }

    public async store(model: ActivationRequest): Promise<ActivationRequest> {
        const item = await this.prismaService.activationRequest.create({
            data: {
                id: model.id(),
                user_id: model.user().id(),
                status: model.status(),
                subject: model.subject(),
                code: model.code(),
                requested_at: model.requestedAt(),
            }
        });

        return this.mapActivationRequestToDomain(item);
    }
    
    public async update(model: ActivationRequest): Promise<void> {
        await this.prismaService.activationRequest.update({
            where: {id: model.id()},
            data: {
                user_id: model.user().id(),
                status: model.status(),
                subject: model.subject(),
                code: model.code(),
                requested_at: model.requestedAt(),
            }
        })
    }

    public async delete(id: string): Promise<void> {
        await this.prismaService.activationRequest.delete({
            where: {id: id}
        });
    }
}