import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from 'src/user/application/ports/out/user-address.repository';
import { GetSpotCommand } from '../../ports/in/commands/get-spot.command';
import { GetSpotDto } from '../../ports/out/dto/get-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { GetSpotService } from '../get-spot.service';
import { mockSpot } from './spot-mock.helper';

describe('GetSpotService', () => {
	let service: GetSpotService;
	let spotRepository: jest.Mocked<SpotRepository>;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(GetSpotService).compile();

		service = unit;
		spotRepository = unitRef.get(SpotRepositoryProvider);
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get spot', async () => {
		const spot = mockSpot();

		const command = new GetSpotCommand(spot.id());

		getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
		userAddressRepository.findBy.mockResolvedValue([]);
		spotRepository.findById.mockResolvedValue(spot);
		spotRepository.countVisitedSpotBy.mockResolvedValue(0);
		spotRepository.countFavoritedSpotBy.mockResolvedValue(0);
		spotRepository.findVisitedSpotBy.mockResolvedValue([]);
		spotRepository.findFavoritedSpotBy.mockResolvedValue([]);

		const result = await service.execute(command);

		expect(result).toBeInstanceOf(GetSpotDto);
	});
});
