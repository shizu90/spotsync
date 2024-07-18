import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListGroupsCommand extends Command {
  constructor(
    readonly name?: string,
    readonly groupVisibility?: string,
    readonly sort?: string,
    readonly sortDirection?: SortDirection,
    readonly page?: number,
    readonly paginate?: boolean,
    readonly limit?: number,
  ) {
    super();
  }
}
