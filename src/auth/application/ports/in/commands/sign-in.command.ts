import { Command } from 'src/common/common.command';

export class SignInCommand extends Command {
  constructor(
    readonly name: string | null,
    readonly email: string | null,
    readonly password: string,
  ) {
    super();
  }
}
