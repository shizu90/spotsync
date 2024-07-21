import { Model } from "src/common/common.model";
import { Post } from "./post.model";

export class PostThread extends Model 
{
    private _id: string;
    private _maxDepthLevel: number;
    private _createdAt: Date;

    private constructor(
        id: string,
        maxDepthLevel?: number,
        createdAt?: Date
    ) 
    {
        super();
        this._id = id;
        this._maxDepthLevel = maxDepthLevel ?? 0;
        this._createdAt = createdAt ?? new Date();
    }

    public static create(
        id: string,
        maxDepthLevel?: number,
        createdAt?: Date
    ) 
    {
        return new PostThread(id, maxDepthLevel, createdAt);
    }

    public id(): string 
    {
        return this._id;
    }

    public maxDepthLevel(): number 
    {
        return this._maxDepthLevel;
    }

    public createdAt(): Date 
    {
        return this._createdAt;
    }

    public changeMaxDepthLevel(maxDepthLevel: number): void 
    {
        this._maxDepthLevel = maxDepthLevel;
    }
}