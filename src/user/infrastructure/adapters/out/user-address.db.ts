import { Pagination } from "src/common/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserAddressRepository } from "src/user/application/ports/out/user-address.repository";
import { UserAddress } from "src/user/domain/user-address.model";

export class UserAddressRepositoryImpl implements UserAddressRepository 
{
    public constructor(protected prismaService: PrismaService) 
    {}

    public async findBy(values: {userId?: string, main?: boolean}): Promise<Array<UserAddress>> 
    {
        const where = {};

        if(values.userId !== null) where['user_id'] = values.userId;
        if(values.main !== null) where['main'] = values.main;

        const userAddresses = await this.prismaService.userAddress.findMany({
            where: where
        });

        return userAddresses.map((userAddress) => {
            if(userAddress === undefined) return null;
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
        });
    }

    public async findAll(): Promise<Array<UserAddress>> {
        return null;
    }

    public async findById(id: string): Promise<UserAddress> {
        return null;
    }

    public async findByUserId(userId: string): Promise<Array<UserAddress>> {
        return null;
    }

    public async findByUserIdAndMain(userId: string, main: boolean): Promise<Array<UserAddress>> {
        return null;
    }

    public async store(model: UserAddress): Promise<UserAddress> {
        return null;
    }

    public async update(model: UserAddress): Promise<UserAddress> {
        return null;
    }

    public async delete(id: string): Promise<void> {
        return null;
    }
}