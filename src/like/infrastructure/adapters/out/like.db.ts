import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { LikeRepository } from 'src/like/application/ports/out/like.repository';
import { Like } from 'src/like/domain/like.model';

export class LikeRepositoryImpl implements LikeRepository {
	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Like>> {
		return null;
	}

	public async findBy(values: Object): Promise<Like[]> {
		return null;
	}

	public async findAll(): Promise<Like[]> {
		return null;
	}

	public async findById(id: string): Promise<Like> {
		return null;
	}

	public async store(model: Like): Promise<Like> {
		return null;
	}

	public async update(model: Like): Promise<Like> {
		return null;
	}

	public async delete(id: string): Promise<void> {
		return null;
	}
}
