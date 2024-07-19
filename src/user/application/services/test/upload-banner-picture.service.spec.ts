import { TestBed } from '@automock/jest';
import { UploadBannerPictureService } from '../upload-banner-picture.service';

describe('UploadBannerPictureService', () => {
	let service: UploadBannerPictureService;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UploadBannerPictureService,
		).compile();

		service = unit;
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
