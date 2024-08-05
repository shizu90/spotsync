import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Geolocator, GeoLocatorOutput, GeoLocatorProvider } from "src/geolocation/geolocator";
import { UpdateSpotCommand } from "../../ports/in/commands/update-spot.command";
import { SpotRepository, SpotRepositoryProvider } from "../../ports/out/spot.repository";
import { UpdateSpotService } from "../update-spot.service";
import { mockSpot } from "./spot-mock.helper";

describe("UpdateSpotService", () => {
    let service: UpdateSpotService;
    let spotRepository: jest.Mocked<SpotRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let geoLocatorService: jest.Mocked<Geolocator>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UpdateSpotService).compile();

        service = unit;
        spotRepository = unitRef.get(SpotRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        geoLocatorService = unitRef.get(GeoLocatorProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update spot', async () => {
        const spot = mockSpot();

        const command = new UpdateSpotCommand(
            spot.id(),
            'New Name',
            null,
            null,
            {
                area: 'New Area',
                subArea: 'New sub area'
            }
        );

        getAuthenticatedUser.execute.mockResolvedValue(spot.creator());
        spotRepository.findById.mockResolvedValue(spot);
        spotRepository.findByName.mockResolvedValue(null);
        geoLocatorService.coordinates.mockResolvedValue(new GeoLocatorOutput(0,0));

        await expect(service.execute(command)).resolves.not.toThrow();
        expect(spot.name()).toBe(command.name);
        expect(spot.address().area()).toBe(command.address.area);
    });
});