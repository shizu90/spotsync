export class SortItemsCommand {
    constructor(
        readonly spotFolderId: string,
        readonly items: { itemId: string, orderNumber: number }[]
    ) {}
}