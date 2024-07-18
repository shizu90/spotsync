import { Model } from 'src/common/common.model';
import { Group } from './group.model';

export class GroupLog extends Model {
  private _id: string;
  private _group: Group;
  private _text: string;
  private _occurredAt: Date;

  private constructor(
    id: string,
    group: Group,
    text: string,
    occurredAt?: Date,
  ) {
    super();
    this._id = id;
    this._group = group;
    this._text = text;
    this._occurredAt = occurredAt ?? new Date();
  }

  public static create(
    id: string,
    group: Group,
    text: string,
    occurredAt?: Date,
  ): GroupLog {
    return new GroupLog(id, group, text, occurredAt);
  }

  public id(): string {
    return this._id;
  }

  public group(): Group {
    return this._group;
  }

  public text(): string {
    return this._text;
  }

  public occurredAt(): Date {
    return this._occurredAt;
  }
}
