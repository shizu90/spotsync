import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListFollowsCommand extends Command {
  constructor(
    readonly from_user_id?: string,
    readonly tro_user_id?: string,
    readonly sort?: string,
    readonly sortDirection?: SortDirection,
    readonly paginate?: boolean,
    readonly page?: number,
    readonly limit?: number,
  ) {
    super();
  }
}