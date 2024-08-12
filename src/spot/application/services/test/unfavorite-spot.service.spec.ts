import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { FavoritedSpot } from 'src/spot/domain/favorited-spot.model';
import { UnfavoriteSpotCommand } from '../../ports/in/commands/unfavorite-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { UnfavoriteSpotService } from '../unfavorite-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('UnfavoriteSpotService', () => {
	let service: UnfavoriteSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UnfavoriteSpotService,
		).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should unfavorite spot', async () => {
		const spot = mockSpot();
		const favoritedSpot = FavoritedSpot.create(
			randomUUID(),
			spot,
			spot.creator(),
		);

		const command = new UnfavoriteSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		spotRepository.findById.mockResolvedValue(spot);
		spotRepository.findFavoritedSpotBy.mockResolvedValue([favoritedSpot]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
