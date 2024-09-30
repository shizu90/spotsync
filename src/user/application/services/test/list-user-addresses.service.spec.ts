import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { ListUserAddressesCommand } from '../../ports/in/commands/list-user-addresses.command';
import { GetUserAddressDto } from '../../ports/out/dto/get-user-address.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../../ports/out/user-address.repository';
import { ListUserAddressesService } from '../list-user-addresses.service';
import { mockUser, mockUserAddress } from './user-mock.helper';

describe('ListUserAddressesService', () => {
	let service: ListUserAddressesService;
	let userAddressRepository: jest.Mocked<UserAddressRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListUserAddressesService,
		).compile();

		service = unit;
		userAddressRepository = unitRef.get(UserAddressRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list user addresses', async () => {
		const user = mockUser();

		const command = new ListUserAddressesCommand(
			user.id(),
			null,
			null,
			null,
			null,
			true,
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);
		userAddressRepository.paginate.mockResolvedValue(
			new Pagination(
				[mockUserAddress(), mockUserAddress(), mockUserAddress()],
				3,
				0,
			),
		);

		const addresses = await service.execute(command);

		expect(addresses).toBeInstanceOf(Pagination<GetUserAddressDto>);

		if (addresses instanceof Pagination) {
			expect(addresses.total).toBe(3);
			expect(addresses.current_page).toBe(0);
			expect(addresses.items).toHaveLength(3);
			expect(addresses.has_next_page).toBeFalsy();
		}
	});
});
