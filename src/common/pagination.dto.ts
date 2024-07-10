export class Pagination<T> 
{
    constructor(
        readonly items: Array<T>,
        readonly total: number
    ) 
    {}
}