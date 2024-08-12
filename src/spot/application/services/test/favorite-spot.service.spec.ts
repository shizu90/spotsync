import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { FavoriteSpotCommand } from '../../ports/in/commands/favorite-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { FavoriteSpotService } from '../favorite-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('FavoriteSpotService', () => {
	let service: FavoriteSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(FavoriteSpotService).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should favorite spot', async () => {
		const spot = mockSpot();

		const command = new FavoriteSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		spotRepository.findById.mockResolvedValue(spot);
		spotRepository.findFavoritedSpotBy.mockResolvedValue([]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
