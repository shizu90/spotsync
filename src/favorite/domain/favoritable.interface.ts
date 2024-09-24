import { User } from "src/user/domain/user.model";
import { Favorite } from "./favorite.model";

export interface Favoritable {
    favorite(user: User): Favorite;
}