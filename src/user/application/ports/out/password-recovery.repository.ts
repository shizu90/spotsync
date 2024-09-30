import { Repository } from 'src/common/core/common.repository';
import { PasswordRecovery } from 'src/user/domain/password-recovery.model';

export const PasswordRecoveryRepositoryProvider = 'PasswordRecoveryRepository';

export interface PasswordRecoveryRepository
	extends Repository<PasswordRecovery, string> {}
