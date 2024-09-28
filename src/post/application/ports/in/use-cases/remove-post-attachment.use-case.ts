import { UseCase } from 'src/common/core/common.use-case';
import { PostDto } from '../../out/dto/post.dto';
import { RemovePostAttachmentCommand } from '../commands/remove-post-attachment.command';

export const RemovePostAttachmentUseCaseProvider =
	'RemovePostAttachmentUseCase';

export interface RemovePostAttachmentUseCase
	extends UseCase<RemovePostAttachmentCommand, Promise<PostDto>> {}
