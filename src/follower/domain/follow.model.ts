import { Model } from 'src/common/common.model';
import { User } from 'src/user/domain/user.model';

export class Follow extends Model {
  private _id: string;
  private _from: User;
  private _to: User;
  private _followedAt: Date;

  private constructor(id: string, from: User, to: User, followedAt?: Date) {
    super();
    this._id = id;
    this._from = from;
    this._to = to;
    this._followedAt = followedAt ?? new Date();
  }

  public static create(
    id: string,
    from: User,
    to: User,
    createdAt?: Date,
  ): Follow {
    return new Follow(id, from, to, createdAt);
  }

  public id(): string {
    return this._id;
  }

  public from(): User {
    return this._from;
  }

  public to(): User {
    return this._to;
  }

  public followedAt(): Date {
    return this._followedAt;
  }
}
