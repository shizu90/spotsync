export class PostAttachmentNotFoundError extends Error {
    constructor(message = 'Post attachment not found.') {
		super(message);
	}
}