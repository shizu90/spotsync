import { Command } from 'src/common/common.command';

export class UpdateUserCredentialsCommand extends Command {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {
    super();
  }
}
