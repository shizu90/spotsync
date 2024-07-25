import { UseCase } from 'src/common/common.use-case';
import { UploadPostAttachmentDto } from '../../out/dto/upload-post-attachment.dto';
import { UploadPostAttachmentCommand } from '../commands/upload-post-attachment.command';

export interface UploadPostAttachmentUseCase
	extends UseCase<
		UploadPostAttachmentCommand,
		Promise<UploadPostAttachmentDto>
	> {}
