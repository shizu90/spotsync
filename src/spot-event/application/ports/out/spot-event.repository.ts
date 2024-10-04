import { Repository } from "src/common/core/common.repository";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";

export const SpotEventRepositoryProvider = "SpotEventRepository";

export interface SpotEventRepository extends Repository<SpotEvent, string> {}