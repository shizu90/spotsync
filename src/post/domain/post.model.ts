import { Model } from 'src/common/common.model';
import { Group } from 'src/group/domain/group.model';
import { User } from 'src/user/domain/user.model';
import { PostVisibility } from './post-visibility.enum';
import { PostAttachment } from './post-attachment.model';
import { PostThread } from './post-thread.model';
import { randomUUID } from 'crypto';

export class Post extends Model {
	private _id: string;
	private _title: string;
	private _content: string;
	private _visibility: PostVisibility;
	private _depthLevel: number;
	private _thread: PostThread;
	private _creator: User;
	private _attachments: PostAttachment[];
	private _group: Group;
	private _parent: Post;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		id: string,
		title: string,
		content: string,
		visibility: PostVisibility,
		creator: User,
		attachments?: PostAttachment[],
		parent?: Post,
		group?: Group,
		thread?: PostThread,
		depthLevel?: number,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		super();
		this._id = id;
		this._title = title;
		this._content = content;
		this._visibility = visibility;
		this._creator = creator;
		this._attachments = attachments ?? [];
		this._thread = thread
			? thread
			: parent
				? parent.thread()
				: PostThread.create(randomUUID(), 0);
		this._depthLevel = parent ? parent.depthLevel() + 1 : depthLevel ?? 0;
		this._parent = parent ?? null;
		this._group = group ?? null;
		this._createdAt = createdAt ?? null;
		this._updatedAt = updatedAt ?? null;

		if (this._thread.maxDepthLevel() === this._depthLevel - 1) {
			this._thread.changeMaxDepthLevel(this._depthLevel);
		}
	}

	public static create(
		id: string,
		title: string,
		content: string,
		visibility: PostVisibility,
		creator: User,
		attachment?: PostAttachment[],
		parent?: Post,
		group?: Group,
		thread?: PostThread,
		depthLevel?: number,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		return new Post(
			id,
			title,
			content,
			visibility,
			creator,
			attachment,
			parent,
			group,
			thread,
			depthLevel,
			createdAt,
			updatedAt,
		);
	}

	public id(): string {
		return this._id;
	}

	public title(): string {
		return this._title;
	}

	public content(): string {
		return this._content;
	}

	public visibility(): PostVisibility {
		return this._visibility;
	}

	public creator(): User {
		return this._creator;
	}

	public group(): Group {
		return this._group;
	}

	public parent(): Post {
		return this._parent;
	}

	public attachments(): PostAttachment[] {
		return this._attachments;
	}

	public thread(): PostThread {
		return this._thread;
	}

	public depthLevel(): number {
		return this._depthLevel;
	}

	public createdAt(): Date {
		return this._createdAt;
	}

	public updatedAt(): Date {
		return this._updatedAt;
	}

	public changeTitle(title: string): void {
		this._title = title;
		this._updatedAt = new Date();
	}

	public changeContent(content: string): void {
		this._content = content;
		this._updatedAt = new Date();
	}

	public changeVisibility(visibility: PostVisibility): void {
		this._visibility = visibility;
		this._updatedAt = new Date();
	}

	public addAttachment(attachment: PostAttachment): void {
		this._attachments.push(attachment);
		this._updatedAt = new Date();
	}

	public removeAttachment(attachmentId: string): void {
		const index = this._attachments.findIndex(
			(a) => a.id() === attachmentId,
		);

		this._attachments = this._attachments.splice(index, 1);
		this._updatedAt = new Date();
	}
}
