import { Pagination } from "src/common/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserAddressRepository } from "src/user/application/ports/out/user-address.repository";
import { UserAddress } from "src/user/domain/user-address.model";

export class UserAddressRepositoryImpl implements UserAddressRepository 
{
    public constructor(protected prismaService: PrismaService) 
    {}

    public async findAll(): Promise<Array<UserAddress>> {
        return null;
    }

    public async findById(id: string): Promise<UserAddress> {
        return null;
    }

    public async findByUserId(userId: string): Promise<Pagination<UserAddress>> {
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