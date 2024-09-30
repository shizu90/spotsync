import { randomUUID } from 'crypto';
import { Comment } from 'src/comment/domain/comment.model';
import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { Commentable } from 'src/comment/domain/commentable.interface';
import { Model } from 'src/common/core/common.model';
import { Favoritable } from 'src/favorite/domain/favoritable.interface';
import { Favorite } from 'src/favorite/domain/favorite.model';
import { Group } from 'src/group/domain/group.model';
import { Spot } from 'src/spot/domain/spot.model';
import { User } from 'src/user/domain/user.model';
import { SpotEventParticipant } from './spot-event-participant.model';
import { SpotEventStatus } from './spot-event-status.enum';
import { SpotEventVisibility } from './spot-event-visibility.enum';

export class SpotEvent extends Model implements Favoritable, Commentable {
	private _id: string;
	private _name: string;
	private _description: string;
	private _startDate: Date;
	private _endDate: Date;
	private _status: SpotEventStatus;
	private _visibility: SpotEventVisibility;
	private _spot: Spot;
	private _group: Group;
	private _participants: SpotEventParticipant[];
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		id: string,
		name: string,
		description: string,
		startDate: Date,
		endDate: Date,
		spot: Spot,
		participants?: SpotEventParticipant[],
		visibility?: SpotEventVisibility,
		status?: SpotEventStatus,
		group?: Group,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		super();
		this._id = id;
		this._name = name;
		this._description = description;
		this._startDate = startDate;
		this._endDate = endDate;
		this._status = status ?? SpotEventStatus.SCHEDULED;
		this._participants = participants ?? [];
		this._visibility = visibility ?? SpotEventVisibility.PUBLIC;
		this._spot = spot;
		this._group = group ?? null;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
	}

	public static create(
		id: string,
		name: string,
		description: string,
		startDate: Date,
		endDate: Date,
		spot: Spot,
		participants?: SpotEventParticipant[],
		visibility?: SpotEventVisibility,
		status?: SpotEventStatus,
		group?: Group,
		createdAt?: Date,
		updatedAt?: Date,
	): SpotEvent {
		return new SpotEvent(
			id,
			name,
			description,
			startDate,
			endDate,
			spot,
			participants,
			visibility,
			status,
			group,
			createdAt,
			updatedAt,
		);
	}

	public id(): string {
		return this._id;
	}

	public name(): string {
		return this._name;
	}

	public description(): string {
		return this._description;
	}

	public startDate(): Date {
		return this._startDate;
	}

	public endDate(): Date {
		return this._endDate;
	}

	public status(): SpotEventStatus {
		return this._status;
	}

	public participants(): SpotEventParticipant[] {
		return this._participants;
	}

	public visibility(): SpotEventVisibility {
		return this._visibility;
	}

	public spot(): Spot {
		return this._spot;
	}

	public group(): Group {
		return this._group;
	}

	public createdAt(): Date {
		return this._createdAt;
	}

	public updatedAt(): Date {
		return this._updatedAt;
	}

	public changeName(name: string): void {
		this._name = name;
		this._updatedAt = new Date();
	}

	public changeDescription(description: string): void {
		this._description = description;
		this._updatedAt = new Date();
	}

	public changeStartDate(startDate: Date): void {
		if (this._status !== SpotEventStatus.SCHEDULED) {
			return;
		}

		this._startDate = startDate;
		this._updatedAt = new Date();
	}

	public changeEndDate(endDate: Date): void {
		if (this._status !== SpotEventStatus.SCHEDULED) {
			return;
		}

		this._endDate = endDate;
		this._updatedAt = new Date();
	}

	public changeVisibility(visibility: SpotEventVisibility): void {
		this._visibility = visibility;
		this._updatedAt = new Date();
	}

	public start(): void {
		if (this._status !== SpotEventStatus.SCHEDULED) {
			return;
		}

		this._status = SpotEventStatus.STARTED;
		this._updatedAt = new Date();
	}

	public isStarted(): boolean {
		return this._status === SpotEventStatus.STARTED;
	}

	public isScheduled(): boolean {
		return this._status === SpotEventStatus.SCHEDULED;
	}

	public isOngoing(): boolean {
		return this._status === SpotEventStatus.ONGOING;
	}

	public isEnded(): boolean {
		return this._status === SpotEventStatus.ENDED;
	}

	public isCanceled(): boolean {
		return this._status === SpotEventStatus.CANCELED;
	}

	public end(): void {
		if (
			this._status !== SpotEventStatus.STARTED &&
			this._status !== SpotEventStatus.ONGOING
		) {
			return;
		}

		this._status = SpotEventStatus.ENDED;
		this._updatedAt = new Date();
	}

	public cancel(): void {
		if (this._status !== SpotEventStatus.SCHEDULED) {
			return;
		}

		this._status = SpotEventStatus.CANCELED;
		this._updatedAt = new Date();
	}

	public findParticipantByUserId(id: string): SpotEventParticipant {
		return this._participants.find(
			(participant) => participant.user().id() === id,
		);
	}

	public findParticipant(user: User): SpotEventParticipant {
		return this._participants.find(
			(participant) => participant.user().id() === user.id(),
		);
	}

	public addParticipant(user: User): SpotEventParticipant {
		const exists = this._participants.some(
			(participant) => participant.user().id() === user.id(),
		);

		if (!exists) {
			const participant = SpotEventParticipant.create(randomUUID(), user);
			this._participants.push(participant);
			this._updatedAt = new Date();

			return participant;
		}

		return null;
	}

	public removeParticipant(user: User): void {
		const idx = this._participants.findIndex(
			(participant) => participant.user().id() === user.id(),
		);
		this._participants = this._participants.splice(idx, 1);
		this._updatedAt = new Date();
	}

	public removeParticipantByUserId(id: string): void {
		const idx = this._participants.findIndex(
			(participant) => participant.user().id() === id,
		);
		this._participants = this._participants.splice(idx, 1);
		this._updatedAt = new Date();
	}

	public favorite(user: User): Favorite {
		return Favorite.createForSpotEvent(randomUUID(), user, this);
	}

	public comment(user: User, text: string): Comment {
		return Comment.create(
			randomUUID(),
			text,
			user,
			CommentableSubject.SPOT_EVENT,
			this,
		);
	}
}
