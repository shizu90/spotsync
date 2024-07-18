import { UseCase } from 'src/common/common.use-case';
import { UploadProfilePictureCommand } from '../commands/upload-profile-picture.command';

export const UploadProfilePictureUseCaseProvider =
	'UploadProfilePictureUseCase';

export interface UploadProfilePictureUseCase
	extends UseCase<UploadProfilePictureCommand, Promise<string>> {}
