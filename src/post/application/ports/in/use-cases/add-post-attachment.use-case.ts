import { UseCase } from 'src/common/common.use-case';
import { AddPostAttachmentDto } from '../../out/dto/add-post-attachment.dto';
import { AddPostAttachmentCommand } from '../commands/add-post-attachment.command';

export const AddPostAttachmentUseCaseProvider = 'AddPostAttachmentUseCase';

export interface AddPostAttachmentUseCase
	extends UseCase<AddPostAttachmentCommand, Promise<AddPostAttachmentDto>> {}
