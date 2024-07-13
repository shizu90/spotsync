import { Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserAddressRepository } from "src/user/application/ports/out/user-address.repository";
import { UserAddress } from "src/user/domain/user-address.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { User } from "src/user/domain/user.model";

export class UserAddressRepositoryImpl implements UserAddressRepository 
{
    public constructor(@Inject(PrismaService) protected prismaService: PrismaService) 
    {}

    private mapUserAddressToDomain(prisma_model: any): UserAddress 
    {
        if(prisma_model === null || prisma_model === undefined) return null;

        return UserAddress.create(
            prisma_model.id,
            prisma_model.name,
            prisma_model.area,
            prisma_model.sub_area,
            prisma_model.locality,
            prisma_model.latitude.toNumber(),
            prisma_model.longitude.toNumber(),
            prisma_model.country_code,
            prisma_model.main,
            User.create(
                prisma_model.user.id,
                prisma_model.user.profile_picture,
                prisma_model.user.banner_picture,
                prisma_model.user.biograph,
                prisma_model.user.birth_date,
                UserCredentials.create(
                    prisma_model.user.id,
                    prisma_model.user.credentials.name,
                    prisma_model.user.credentials.email,
                    prisma_model.user.credentials.password,
                    prisma_model.user.credentials.last_login,
                    prisma_model.user.credentials.last_logout
                ),
                UserVisibilityConfig.create(
                    prisma_model.user.id,
                    prisma_model.user.visibility_configuration.profile_visibility,
                    prisma_model.user.visibility_configuration.address_visibility,
                    prisma_model.user.visibility_configuration.poi_folder_visibility,
                    prisma_model.user.visibility_configuration.visited_poi_visibility,
                    prisma_model.user.visibility_configuration.post_visibility,
                ),
                prisma_model.user.created_at,
                prisma_model.user.updated_at,
                prisma_model.is_deleted
            ),
            prisma_model.created_at,
            prisma_model.updated_at,
            prisma_model.is_deleted
        )
    }

    public async findBy(values: Object): Promise<Array<UserAddress>> 
    {
        const userId = values['userId'];
        const main = values['main'];
        const isDeleted = values['isDeleted'];

        const sort = values['sort'];
        const sortDirection = values['sortDirection'];
        const paginate = values['paginate'] ?? false;
        const page = values['page'] ?? 0;
        const limit = values['limit'] ?? 12;

        let query = `SELECT id FROM user_addresses`;

        if(userId) {
            if(query.includes('WHERE')) {
                query = `${query} AND user_id = '${userId}'`;
            }else {
                query = `${query} WHERE user_id = '${userId}'`;
            }
        }

        if(main) {
            if(query.includes('WHERE')) {
                query = `${query} AND main = ${main}`;
            }else {
                query = `${query} WHERE main = ${main}`;
            }
        }

        if(isDeleted) {
            if(query.includes('WHERE')) {
                query = `${query} AND is_deleted = ${isDeleted}`;
            }else {
                query = `${query} WHERE is_deleted = ${isDeleted}`;
            }
        }

        const userAddressIds = await this.prismaService.$queryRawUnsafe<{id: string}[]>(query);

        let orderBy = {};

        switch(sort) {
            case 'name':
                orderBy = {
                    name: sortDirection
                };

                break;
            case 'id':
            default:
                orderBy = {
                    id: sortDirection
                };

                break;
        }

        let userAddresses = [];

        if(paginate) {
            userAddresses = await this.prismaService.userAddress.findMany({
                where: {id: {in: userAddressIds.map((row) => row.id)}},
                orderBy: orderBy,
                include: {user: {include: {credentials: true, visibility_configuration: true}}},
                skip: page * limit,
                take: limit
            });
        }else {
            userAddresses = await this.prismaService.userAddress.findMany({
                where: {id: {in: userAddressIds.map((row) => row.id)}},
                orderBy: orderBy,
                include: {user: {include: {credentials: true, visibility_configuration: true}}}
            });
        }
        
        return userAddresses.map((userAddress) => {
            return this.mapUserAddressToDomain(userAddress);
        });
    }

    public async findAll(): Promise<Array<UserAddress>> {
        const userAddresses = await this.prismaService.userAddress.findMany({
            include: {
                user: {
                    include: {
                        credentials: true,
                        visibility_configuration: true
                    }
                }
            }
        });

        return userAddresses.map((userAddress) => {
            return this.mapUserAddressToDomain(userAddress);
        });
    }

    public async findById(id: string): Promise<UserAddress> {
        const userAddress = await this.prismaService.userAddress.findFirst({
            where: {
                id: id
            },
            include: {
                user: {include: {credentials: true, visibility_configuration: true}}
            }
        });

        return this.mapUserAddressToDomain(userAddress);
    }

    public async store(model: UserAddress): Promise<UserAddress> {
        const userAddress = await this.prismaService.userAddress.create({
            data: {
                id: model.id(),
                name: model.name(),
                area: model.area(),
                sub_area: model.subArea(),
                latitude: model.latitude(),
                longitude: model.longitude(),
                country_code: model.countryCode(),
                locality: model.locality(),
                main: model.main(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                user_id: model.user().id()
            },
            include: {
                user: {include: {credentials: true, visibility_configuration: true}}
            }
        });

        return this.mapUserAddressToDomain(userAddress);
    }

    public async update(model: UserAddress): Promise<UserAddress> {
        const userAddress = await this.prismaService.userAddress.update({
            where: {
                id: model.id()
            },
            data: {
                name: model.name(),
                area: model.area(),
                sub_area: model.subArea(),
                locality: model.locality(),
                country_code: model.countryCode(),
                latitude: model.latitude(),
                longitude: model.longitude(),
                main: model.main(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                is_deleted: model.isDeleted()
            },
            include: {
                user: {
                    include: {credentials: true, visibility_configuration: true}
                }
            }
        });

        return this.mapUserAddressToDomain(userAddress);
    }

    public async delete(id: string): Promise<void> {
        this.prismaService.userAddress.delete({
            where: {id: id}
        });
    }
}