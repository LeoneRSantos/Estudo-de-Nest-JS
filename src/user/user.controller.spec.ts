import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
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
      createUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UsersService, useValue: mockUsersServiceValue },
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUsersService = module.get(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser possível retornar a lista de usuários', async () => {
    const usuarios = await controller.listarUsuarios();
    expect(usuarios).toBeInstanceOf(Array);
    expect(mockUsersService.users).toHaveBeenCalledWith({}); // Verifica se o método foi chamado
  });

  it('Deve ser possível cadastrar um usuário', async () => {
    const usuario = {
      email: usuariosMock.at(0)?.email as string,
      name: usuariosMock.at(0)?.name as string,
      password: usuariosMock.at(0)?.password as string
    };

    // Mock o retorno do serviço
    mockUsersService.createUser.mockResolvedValueOnce(usuario as any);

    const resultado = await controller.cadastrarUsuario(usuario);

    expect(resultado).toEqual(usuario);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(usuario);
  });

  it('atualizarUsuario() deve atualizar um usuário válido', async () => {
    const usuario = usuariosMock.at(0);

    mockUsersService.updateUser.mockResolvedValueOnce(usuario as any);

    const resultado = await controller.atualizarUsuario(usuario?.id as any, usuario as any);

    expect(resultado).toEqual(usuario);
  });
});