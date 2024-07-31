import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { LikeCommand } from '../../ports/in/commands/like.command';
import { LikeDto } from '../../ports/out/dto/like.dto';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../../ports/out/like.repository';
import { LikeService } from '../like.service';
import { mockLike } from './like-mock.helper';

describe('LikeService', () => {
	let service: LikeService;
	let likeRepository: jest.Mocked<LikeRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(LikeService).compile();

		service = unit;
		likeRepository = unitRef.get(LikeRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should like a subject', async () => {
		const like = mockLike();

		const command = new LikeCommand(
			like.likableSubject(),
			like.likableSubjectId(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(like.user());

		const response = await service.execute(command);

		expect(response).toBeInstanceOf(LikeDto);
	});
});
