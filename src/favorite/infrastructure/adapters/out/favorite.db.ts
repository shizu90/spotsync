import { Inject, Injectable } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { FavoriteRepository } from "src/favorite/application/ports/out/favorite.repository";
import { Favorite } from "src/favorite/domain/favorite.model";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FavoriteRepositoryImpl implements FavoriteRepository {
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

    public async paginate(params: PaginateParameters): Promise<Pagination<Favorite>> {
        throw new Error("Method not implemented.");
    }
    
    public async findBy(values: Object): Promise<Favorite[]> {
        throw new Error("Method not implemented.");
    }
    
    public async countBy(values: Object): Promise<number> {
        throw new Error("Method not implemented.");
    }
    
    public async findById(id: string): Promise<Favorite> {
        throw new Error("Method not implemented.");
    }
    
    public async findAll(): Promise<Favorite[]> {
        throw new Error("Method not implemented.");
    }
    
    public async store(model: Favorite): Promise<Favorite> {
        throw new Error("Method not implemented.");
    }
    
    public async update(model: Favorite): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}