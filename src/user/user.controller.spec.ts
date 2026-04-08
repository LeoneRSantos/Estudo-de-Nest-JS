import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    // Mock do UsersService
    const mockUsersServiceValue = {
      users: jest.fn().mockResolvedValue([]), // Simula retorno de array vazio
    };

    // Mock do ConfigService (se necessário para Prisma)
    const mockConfigServiceValue = {
      get: jest.fn().mockReturnValue('mocked-db-url'), // Simula DATABASE_URL
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UsersService, useValue: mockUsersServiceValue },
        { provide: ConfigService, useValue: mockConfigServiceValue },
        // PrismaService pode ser omitido se não for diretamente usado no controller
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
