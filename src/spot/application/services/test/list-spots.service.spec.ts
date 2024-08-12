import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from 'src/follower/application/ports/out/follow.repository';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from 'src/user/application/ports/out/user-address.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { ListSpotsCommand } from '../../ports/in/commands/list-spots.command';
import { GetSpotDto } from '../../ports/out/dto/get-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { ListSpotsService } from '../list-spots.service';
import { mockSpot, mockUser } from './spot-mock.helper';

describe('ListSpotsService', () => {
	let service: ListSpotsService;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let followRepository: jest.Mocked<FollowRepository>;
	let spotRepository: jest.Mocked<SpotRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListSpotsService).compile();

		service = unit;
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		followRepository = unitRef.get(FollowRepositoryProvider);
		spotRepository = unitRef.get(SpotRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list spots', async () => {
		const user = mockUser();

		const command = new ListSpotsCommand();

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userAddressRepository.findBy.mockResolvedValue([]);
		spotRepository.paginate.mockResolvedValue(
			new Pagination([mockSpot(), mockSpot(), mockSpot()], 3, 0),
		);
		spotRepository.countVisitedSpotBy.mockResolvedValue(0);
		spotRepository.countFavoritedSpotBy.mockResolvedValue(0);
		spotRepository.findVisitedSpotBy.mockResolvedValue([]);
		spotRepository.findFavoritedSpotBy.mockResolvedValue([]);

		const result = await service.execute(command);

		expect(result).toBeInstanceOf(Pagination<GetSpotDto>);
	});
});
