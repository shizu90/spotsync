import { Inject, Injectable } from "@nestjs/common";
import { CommentRepository } from "src/comment/application/ports/out/comment.repository";
import { CommentSubject } from "src/comment/domain/comment-subject.model.";
import { Comment } from "src/comment/domain/comment.model";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentEntityMapper } from "./mappers/comment-entity.mapper";

@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
    private _commentEntityMapper: CommentEntityMapper = new CommentEntityMapper();
    
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) {}

    private _mapCommentableId(subject: CommentSubject): string {
        switch (subject) {
            case CommentSubject.SPOT:
                return 'spot_id';
            case CommentSubject.SPOT_EVENT:
                return 'spot_event_id';
            default: 
                return '';
        }
    }

    private _mountQuery(values: Object): Object {
        const subject = values['subject'];
        const subjectId = values['subjectId'];
        const userId = values['userId'];
        
        let query = {};

        if (subject) {
            query['subject'] = subject;
        }

        if (subjectId && subject) {
            query[this._mapCommentableId(subject)] = subjectId;
        }

        if (userId) {
            query['user_id'] = userId;
        }

        return query;
    }

    private _mountInclude(): Object {
        return {
            user: {
                include: {
                    profile: true,
                    credentials: true,
                    visibility_settings: true,
                }
            },
            spot: {
                include: {
                    address: true,
                    photos: true,
                    creator: {
                        include: {
                            profile: true,
                            credentials: true,
                            visibility_settings: true,
                        }
                    }
                }
            }
        };
    }

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