import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	Geolocator,
	GeoLocatorOutput,
	GeoLocatorProvider,
} from 'src/geolocation/geolocator';
import { SpotType } from 'src/spot/domain/spot-type.enum';
import { CreateSpotCommand } from '../../ports/in/commands/create-spot.command';
import { CreateSpotDto } from '../../ports/out/dto/create-spot.dto';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../../ports/out/spot.repository';
import { CreateSpotService } from '../create-spot.service';
import { mockUser } from './spot-mock.helper';

describe('CreateSpotService', () => {
	let service: CreateSpotService;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let spotRepository: jest.Mocked<SpotRepository>;
	let geoLocatorService: jest.Mocked<Geolocator>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreateSpotService).compile();

		service = unit;
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		spotRepository = unitRef.get(SpotRepositoryProvider);
		geoLocatorService = unitRef.get(GeoLocatorProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create spot', async () => {
		const user = mockUser();

		const command = new CreateSpotCommand(
			'Spot name',
			SpotType.MALL,
			{
				area: 'State',
				subArea: 'City',
				locality: 'Neighborhood',
				countryCode: 'BR',
			},
			'Spot description',
		);

		getAuthenticatedUser.execute.mockResolvedValue(user);
		geoLocatorService.coordinates.mockResolvedValue(
			new GeoLocatorOutput(0, 0),
		);
		spotRepository.findByName.mockResolvedValue(null);

		const spot = await service.execute(command);

		expect(spot).toBeInstanceOf(CreateSpotDto);
		expect(spot.address.latitude).toBe(0);
		expect(spot.address.longitude).toBe(0);
	});
});
