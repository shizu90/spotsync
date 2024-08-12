import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { VisitSpotCommand } from '../../ports/in/commands/visit-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { VisitSpotService } from '../visit-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('VisitSpotService', () => {
	let service: VisitSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(VisitSpotService).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should visit spot', async () => {
		const spot = mockSpot();

		const command = new VisitSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		spotRepository.findById.mockResolvedValue(spot);
		spotRepository.findVisitedSpotBy.mockResolvedValue([]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
