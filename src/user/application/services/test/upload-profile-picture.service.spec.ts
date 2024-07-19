import { TestBed } from "@automock/jest";
import { UploadProfilePictureService } from "../upload-profile-picture.service";

describe('UploadProfilePictureService', () => {
    let service: UploadProfilePictureService;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UploadProfilePictureService).compile();

        service = unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});