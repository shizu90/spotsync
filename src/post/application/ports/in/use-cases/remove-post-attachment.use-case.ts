import { UseCase } from 'src/common/common.use-case';
import { RemovePostAttachmentCommand } from '../commands/remove-post-attachment.command';

export interface RemovePostAttachmentUseCase
	extends UseCase<RemovePostAttachmentCommand, Promise<void>> {}
