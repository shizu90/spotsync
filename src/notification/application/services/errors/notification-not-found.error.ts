export class NotificationNotFoundError extends Error {
    constructor(message: string = 'Notification not found') {
        super(message);
    }
}