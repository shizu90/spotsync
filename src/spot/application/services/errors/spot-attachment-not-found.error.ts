export class SpotAttachmentNotFoundError extends Error {
    constructor(message: string = "Spot attachment not found.") {
        super(message);
    }
}