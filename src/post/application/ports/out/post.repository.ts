import { Repository } from "src/common/common.repository";
import { PostAttachment } from "src/post/domain/post-attachment.model";
import { Post } from "src/post/domain/post.model";

export const PostRepositoryProvider = "PostRepository";

export interface PostRepository extends Repository<Post, string> 
{
    findAttachmentById(id: string): Promise<PostAttachment>;
}