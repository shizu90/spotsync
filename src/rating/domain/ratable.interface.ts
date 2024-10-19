import { User } from "src/user/domain/user.model";
import { Rating } from "./rating.model";

export interface Ratable {
    rate(value: number, user: User, comment?: string): Rating;
}