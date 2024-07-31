import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnlikeCommand } from '../../ports/in/commands/unlike.command';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../../ports/out/like.repository';
import { UnlikeService } from '../unlike.service';
import { mockLike } from './like-mock.helper';

describe('UnlikeService', () => {
	let service: UnlikeService;
	let likeRepository: jest.Mocked<LikeRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(UnlikeService).compile();

		service = unit;
		likeRepository = unitRef.get(LikeRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should unlike a subject', async () => {
		const like = mockLike();

		const command = new UnlikeCommand(
			like.likableSubject(),
			like.likableSubjectId(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(like.user());
		likeRepository.findBy.mockResolvedValue([like]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
