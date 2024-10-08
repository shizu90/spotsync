import { UseCase } from 'src/common/core/common.use-case';
import { UploadBannerPictureCommand } from '../commands/upload-banner-picture.command';

export const UploadBannerPictureUseCaseProvider = 'UploadBannerPictureUseCase';

export interface UploadBannerPictureUseCase
	extends UseCase<UploadBannerPictureCommand, Promise<string>> {}
