import { Injectable } from "@nestjs/common";
import { CommentRepository } from "src/comment/application/ports/out/comment.repository";
import { Comment } from "src/comment/domain/comment.model";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { CommentEntityMapper } from "./mappers/comment-entity.mapper";

@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
    private _commentEntityMapper: CommentEntityMapper = new CommentEntityMapper();
    
    public async paginate(params: PaginateParameters): Promise<Pagination<Comment>> {
        throw new Error("Method not implemented.");
    }
    
    public async findBy(values: Object): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    
    public async countBy(values: Object): Promise<number> {
        throw new Error("Method not implemented.");
    }
    
    public async findById(id: string): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    
    public async findAll(): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    
    public async store(model: Comment): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    
    public async update(model: Comment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}