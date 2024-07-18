import { Inject, Injectable } from '@nestjs/common';
import { UploadProfilePictureCommand } from '../ports/in/commands/upload-profile-picture.command';
import { UploadProfilePictureUseCase } from '../ports/in/use-cases/upload-profile-picture.use-case';
import {
  UserRepository,
  UserRepositoryProvider,
} from '../ports/out/user.repository';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';

@Injectable()
export class UploadProfilePictureService
  implements UploadProfilePictureUseCase
{
  constructor(
    @Inject(UserRepositoryProvider)
    protected userRepository: UserRepository,
    @Inject(GetAuthenticatedUserUseCaseProvider)
    protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  public async execute(command: UploadProfilePictureCommand): Promise<string> {
    return '';
  }
}
