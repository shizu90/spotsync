import { Command } from 'src/common/common.command';

export class DeleteGroupCommand extends Command {
  constructor(readonly id: string) {
    super();
  }
}
