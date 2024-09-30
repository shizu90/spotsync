import { Repository } from 'src/common/core/common.repository';
import { ActivationRequest } from 'src/user/domain/activation-request.model';

export const ActivationRequestRepositoryProvider =
	'ActivationRequestRepository';

export interface ActivationRequestRepository
	extends Repository<ActivationRequest, string> {}
