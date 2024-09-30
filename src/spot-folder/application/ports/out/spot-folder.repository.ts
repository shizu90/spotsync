import { Repository } from 'src/common/core/common.repository';
import { SpotFolder } from 'src/spot-folder/domain/spot-folder.model';

export const SpotFolderRepositoryProvider = 'SpotFolderRepository';

export interface SpotFolderRepository extends Repository<SpotFolder, string> {}
