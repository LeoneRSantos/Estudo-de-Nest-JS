import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { mockUsersServiceValue, usuarioMock } from '../../test/mocks/usuarios-helpers';
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
      validarSenha: jest.fn(),
      validarEmail: jest.fn()
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

  it('UserController deve ser definido', async () => {
    expect(controller).toBeDefined();
  });

  it('listarUsuarios() deve retornar a lista de usuários', async () => {
    const usuarios = await controller.listarUsuarios();
    expect(usuarios).toBeInstanceOf(Array);
    expect(mockUsersService.users).toHaveBeenCalledWith({}); // Verifica se o método foi chamado
  });

  it('cadastrarUsuario() deve cadastrar um usuário', async () => {

    // Extrai name, email e password de usuarioMock
    const { name, email, password } = usuarioMock;
    const usuario = { name, email, password };

    // Mock o retorno do serviço
    mockUsersService.createUser.mockResolvedValueOnce(usuario as any);

    const resultado = await controller.cadastrarUsuario(usuario);

    expect(resultado).toEqual(usuario);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(usuario);
  });

  it('cadastrarUsuario() deve lançar um erro caso não consiga fazer o cadastro', async () => {
    // Extrai name, email e password de usuarioMock
    const { name, email, password } = usuarioMock;
    const usuario = { name, email, password };

    // Mock o retorno do serviço
    mockUsersService.createUser.mockResolvedValueOnce({ message: '' });

    await expect(controller.cadastrarUsuario(usuario)).rejects.toThrow(Error);
    expect(userService.createUser).toHaveBeenLastCalledWith(usuario);
  });

  it('cadastrarUsuario() deve lançar um erro em caso de senha inválida', async () => {
    // Extrai name, email e password de usuarioMock
    const { name, email } = usuarioMock;
    const usuario = { name, email, password: '1456' };

    mockUsersService.validarSenha.mockResolvedValueOnce({ message: '' });

    await expect(controller.cadastrarUsuario(usuario)).rejects.toThrow(Error);
  });

  it('cadastrarUsuario() deve lançar um erro em caso e-mail inválido', async () => {
    const { name, password } = usuarioMock
    const usuario = { name, email: 'emailinvalido', password };

    mockUsersService.validarEmail.mockResolvedValueOnce({ message: '' });

    await expect(controller.cadastrarUsuario(usuario)).rejects.toThrow(Error);
  });

  it('atualizarUsuario() deve atualizar um usuário válido', async () => {
    mockUsersService.updateUser.mockResolvedValueOnce(usuarioMock as any);

    const resultado = await controller.atualizarUsuario(usuarioMock.id as any, usuarioMock as any);

    expect(resultado).toEqual(usuarioMock);
  });

  it('atualizarUsuario() deve atualizar a senha de um usuário', async () => {
    const { id, name, email } = usuarioMock;
    const usuario = { id, email, name, password: '12345678' }

    mockUsersService.updateUser.mockResolvedValueOnce(usuario);

    const resultado = await controller.atualizarUsuario(usuario.id as any, usuario);

    expect(resultado).toEqual(usuario);
    expect(resultado.password).toEqual(usuario.password);
  });

  it('atualizarUsuario() deve atualizar o e-mail de um usuário', async () => {
    const { id, name, password } = usuarioMock
    const usuario = { id, name, email: 'emailnovodousuario@email.com', password };

    mockUsersService.updateUser.mockResolvedValueOnce(usuario);
    const resultado = await controller.atualizarUsuario(usuario.id as any, usuario);

    expect(resultado).toEqual(usuario);
    expect(resultado.email).toEqual(usuario.email);
  });

  it('atualizarUsuario() deve atualizar o nome de um usuário', async () => {
    const { id, email, password } = usuarioMock
    const usuario = { id, email, password, name: 'novo usuário' }

    mockUsersService.updateUser.mockResolvedValueOnce(usuario);

    const resultado = await controller.atualizarUsuario(usuario.id as any, usuario);

    expect(resultado).toBe(usuario);
    expect(resultado.name).toEqual(usuario.name);
  });
});