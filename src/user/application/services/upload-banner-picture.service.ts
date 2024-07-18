import { Inject, Injectable } from '@nestjs/common';
import { UploadBannerPictureCommand } from '../ports/in/commands/upload-banner-picture.command';
import { UploadBannerPictureUseCase } from '../ports/in/use-cases/upload-banner-picture.use-case';
import {
  UserRepository,
  UserRepositoryProvider,
} from '../ports/out/user.repository';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';

@Injectable()
export class UploadBannerPictureService implements UploadBannerPictureUseCase {
  constructor(
    @Inject(UserRepositoryProvider)
    protected userRepository: UserRepository,
    @Inject(GetAuthenticatedUserUseCaseProvider)
    protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  public async execute(command: UploadBannerPictureCommand): Promise<string> {
    return '';
  }
}
