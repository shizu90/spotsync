import { Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserAddressRepository } from "src/user/application/ports/out/user-address.repository";
import { UserAddress } from "src/user/domain/user-address.model";
import { User } from "src/user/domain/user.model";

export class UserAddressRepositoryImpl implements UserAddressRepository 
{
    public constructor(@Inject(PrismaService) protected prismaService: PrismaService) 
    {}

    public async findBy(values: Object): Promise<Array<UserAddress>> 
    {
        const userId = values['userId'];
        const main = values['main'];
        const isDeleted = values['isDeleted'];

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

        const userAddresses = await this.prismaService.userAddress.findMany({
            where: {id: {in: userAddressIds.map((row) => row.id)}}
        });

        return userAddresses.map((userAddress) => {
            if(userAddress) {
                return UserAddress.create(
                    userAddress.id,
                    userAddress.name,
                    userAddress.area,
                    userAddress.sub_area,
                    userAddress.locality,
                    userAddress.latitude.toNumber(),
                    userAddress.longitude.toNumber(),
                    userAddress.country_code,
                    userAddress.main,
                    null,
                    userAddress.created_at,
                    userAddress.updated_at
                );
            }else {
                return null;
            }
        });
    }

    public async findAll(): Promise<Array<UserAddress>> {
        const userAddresses = await this.prismaService.userAddress.findMany();

        return userAddresses.map((userAddress) => {
            if(userAddress) {
                return UserAddress.create(
                    userAddress.id,
                    userAddress.name,
                    userAddress.area,
                    userAddress.sub_area,
                    userAddress.locality,
                    userAddress.latitude.toNumber(),
                    userAddress.longitude.toNumber(),
                    userAddress.country_code,
                    userAddress.main,
                    null,
                    userAddress.created_at,
                    userAddress.updated_at
                );
            }else {
                return null;
            }
        });
    }

    public async findById(id: string): Promise<UserAddress> {
        const userAddress = await this.prismaService.userAddress.findFirst({
            where: {
                id: id
            },
            include: {
                user: true
            }
        });

        if(userAddress === null || userAddress === undefined) return null;

        return UserAddress.create(
            userAddress.id,
            userAddress.name,
            userAddress.area,
            userAddress.sub_area,
            userAddress.locality,
            userAddress.latitude.toNumber(),
            userAddress.longitude.toNumber(),
            userAddress.country_code,
            userAddress.main,
            User.create(
                userAddress.user.id,
                userAddress.user.profile_picture,
                userAddress.user.banner_picture,
                userAddress.user.biograph,
                userAddress.user.birth_date,
                userAddress.user.profile_visibility,
                null,
                userAddress.user.created_at,
                userAddress.user.updated_at,
                userAddress.user.is_deleted
            ),
            userAddress.created_at,
            userAddress.updated_at,
            userAddress.is_deleted
        );
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
            }
        });

        if(userAddress === null || userAddress === undefined) return null;

        return UserAddress.create(
            userAddress.id,
            userAddress.name,
            userAddress.area,
            userAddress.sub_area,
            userAddress.locality,
            userAddress.latitude.toNumber(),
            userAddress.longitude.toNumber(),
            userAddress.country_code,
            userAddress.main,
            null,
            userAddress.created_at,
            userAddress.updated_at
        );
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
            }
        });

        if(userAddress === null || userAddress === undefined) return null;
        
        return UserAddress.create(
            userAddress.id,
            userAddress.name,
            userAddress.area,
            userAddress.sub_area,
            userAddress.locality,
            userAddress.latitude.toNumber(),
            userAddress.longitude.toNumber(),
            userAddress.country_code,
            userAddress.main,
            null,
            userAddress.created_at,
            userAddress.updated_at
        );
    }

    public async delete(id: string): Promise<void> {
        this.prismaService.userAddress.delete({
            where: {id: id}
        });
    }
}