import { User } from "src/user/domain/user.model";
import { Like } from "./like.model";

export interface Likable {
    like(user: User): Like;
}