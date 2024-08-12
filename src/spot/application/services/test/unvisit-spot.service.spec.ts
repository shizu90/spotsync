import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';
import { UnvisitSpotCommand } from '../../ports/in/commands/unvisit-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { UnvisitSpotService } from '../unvisit-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('UnvisitSpotService', () => {
	let service: UnvisitSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(UnvisitSpotService).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should unvisit spot', async () => {
		const spot = mockSpot();
		const visitedSpot = VisitedSpot.create(
			randomUUID(),
			spot,
			spot.creator(),
		);

		const command = new UnvisitSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		spotRepository.findById.mockResolvedValue(spot);
		spotRepository.findVisitedSpotBy.mockResolvedValue([visitedSpot]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
