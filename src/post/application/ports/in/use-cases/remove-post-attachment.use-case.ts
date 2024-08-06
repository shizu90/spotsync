import { UseCase } from 'src/common/core/common.use-case';
import { RemovePostAttachmentCommand } from '../commands/remove-post-attachment.command';

export const RemovePostAttachmentUseCaseProvider =
	'RemovePostAttachmentUseCase';

export interface RemovePostAttachmentUseCase
	extends UseCase<RemovePostAttachmentCommand, Promise<void>> {}
