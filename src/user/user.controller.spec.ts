import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './user.service';
import { usuariosMock } from '../../test/mocks/usuarios-helpers';
import { PrismaService } from '../database/prisma/prisma.service';
import { createMockPrismaService } from '../../test/mocks/prisma-helpers';

describe('UserController', () => {
  let controller: UserController;
  let mockUsersService: jest.Mocked<UsersService>;
  let prismaService: PrismaService;
  let userService: UsersService;

  // Mock do PrismaService
  const mockPrismaService = createMockPrismaService('user');


  beforeEach(async () => {
    // Mock do UsersService
    const mockUsersServiceValue = {
      users: jest.fn().mockResolvedValue([]), // Simula retorno de array vazio
      createUser: jest.fn()
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
    mockUsersService = module.get(UsersService);
  });

  it('Deve ser possível retornar a lista de usuários', async () => {
    const usuarios = await controller.listarUsuarios();
    expect(usuarios).toBeInstanceOf(Array);
    expect(mockUsersService.users).toHaveBeenCalledWith({}); // Verifica se o método foi chamado
  });
});