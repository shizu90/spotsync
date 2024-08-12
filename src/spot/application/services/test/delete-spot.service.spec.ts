import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DeleteSpotCommand } from '../../ports/in/commands/delete-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { DeleteSpotService } from '../delete-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('DeleteSpotService', () => {
	let service: DeleteSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(DeleteSpotService).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should delete spot', async () => {
		const spot = mockSpot();

		const command = new DeleteSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		spotRepository.findById.mockResolvedValue(spot);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(spot.isDeleted()).toBeTruthy();
	});
});
