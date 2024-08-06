import { Command } from 'src/common/core/common.command';

export class ChangeMemberRoleCommand extends Command {
	constructor(
		readonly id: string,
		readonly groupId: string,
		readonly roleId: string,
	) {
		super();
	}
}
