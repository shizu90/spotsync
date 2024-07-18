import { Command } from 'src/common/common.command';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class UpdateGroupVisibilityCommand extends Command {
  constructor(
    readonly id: string,
    readonly groupVisibility: GroupVisibility,
    readonly postVisibility: GroupVisibility,
    readonly eventVisibility: GroupVisibility,
  ) {
    super();
  }
}
