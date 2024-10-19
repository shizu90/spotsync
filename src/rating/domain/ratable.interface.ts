import { User } from "src/user/domain/user.model";
import { Rating } from "./rating.model";

export interface Ratable {
    id(): string;
    rate(value: number, user: User, comment?: string): Rating;
}