export class SortItemsCommand {
    constructor(
        readonly spotFolderId: string,
        readonly items: { spotId: string, orderNumber: number }[]
    ) {}
}