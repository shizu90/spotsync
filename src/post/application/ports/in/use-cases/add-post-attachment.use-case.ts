import { UseCase } from 'src/common/core/common.use-case';
import { PostDto } from '../../out/dto/post.dto';
import { AddPostAttachmentCommand } from '../commands/add-post-attachment.command';

export const AddPostAttachmentUseCaseProvider = 'AddPostAttachmentUseCase';

export interface AddPostAttachmentUseCase
	extends UseCase<AddPostAttachmentCommand, Promise<PostDto>> {}
