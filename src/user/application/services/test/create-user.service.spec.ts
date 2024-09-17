import { TestBed } from '@automock/jest';
import { Mail, MailProvider } from 'src/mail/mail';
import { CreateUserCommand } from '../../ports/in/commands/create-user.command';
import { CreateUserDto } from '../../ports/out/dto/create-user.dto';
import {
	UserRepository,
	UserRepositoryProvider,
} from '../../ports/out/user.repository';
import { CreateUserService } from '../create-user.service';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { mockUser } from './user-mock.helper';

describe('CreateUserService', () => {
	let service: CreateUserService;
	let userRepository: jest.Mocked<UserRepository>;
	let mail: jest.Mocked<Mail>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreateUserService).compile();

		service = unit;
		userRepository = unitRef.get(UserRepositoryProvider);
		mail = unitRef.get(MailProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create an user', async () => {
		const command = new CreateUserCommand(
			new Date(),
			'Test',
			'test@test.test',
			'test123',
			'+55 11 99112-5784',
		);

		userRepository.findByEmail.mockResolvedValue(null);
		userRepository.findByName.mockResolvedValue(null);
		mail.setReceiver.mockReturnValue(mail);
		mail.setTemplate.mockReturnValue(mail);

		const user = await service.execute(command);

		expect(user).toBeInstanceOf(CreateUserDto);
		expect(user.credentials.name).toBe(command.name);
		expect(user.credentials.email).toBe(command.email);
		expect(user.credentials.phone_number).toBe(command.phoneNumber);
		expect(user.profile.display_name).toBe(command.name);
	});

	it('should not create an user if email is already in use', async () => {
		const command = new CreateUserCommand(
			new Date(),
			'Test',
			'test@test.test',
			'test123',
			'+55 11 99112-5784',
		);

		userRepository.findByEmail.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UserAlreadyExistsError,
		);
	});

	it('should not create an user if name is already taken', async () => {
		const command = new CreateUserCommand(
			new Date(),
			'Test',
			'test@test.test',
			'test123',
			'+55 11 99112-5784',
		);

		userRepository.findByEmail.mockResolvedValue(null);
		userRepository.findByName.mockResolvedValue(mockUser());

		await expect(service.execute(command)).rejects.toThrow(
			UserAlreadyExistsError,
		);
	});
});
