import { Command } from 'src/common/common.command';

export class GetUserProfileCommand extends Command {
  constructor(
    readonly id?: string,
    readonly name?: string,
  ) {
    super();
  }
}
