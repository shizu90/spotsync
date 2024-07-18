import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListUserAddressesCommand extends Command {
  constructor(
    readonly userId: string,
    readonly name?: string,
    readonly main?: boolean,
    readonly sort?: string,
    readonly sortDirection?: SortDirection,
    readonly paginate?: boolean,
    readonly page?: number,
    readonly limit?: number,
  ) {
    super();
  }
}
