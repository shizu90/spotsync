import { Command } from 'src/common/common.command';

export class AcceptFollowRequestCommand extends Command {
  constructor(readonly followRequestId: string) {
    super();
  }
}
