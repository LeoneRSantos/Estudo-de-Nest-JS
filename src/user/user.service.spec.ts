import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockPrismaService, mockConfigService, mockFindMany, mockFindUnique, MockListarUsuarios } from '../../test/mocks/prisma-helpers';
import { usuarioMock, usuariosMock } from '../../test/mocks/usuarios-helpers';

describe('UserService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock do PrismaService
  const mockPrismaService = createMockPrismaService('user');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre testes
  });

  it('Deve definir o serviço', () => {
    expect(service).toBeDefined();
  });

  // verificar se o método chama `prisma.user.findUnique` com o `where` correto
  it('O findUnique do Prisma precisa ser chamado com o parâmetro certo', async () => {
    mockFindUnique(prismaService, 'user', usuarioMock);

    const resultado = await service.user({ email: usuarioMock.email });

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: usuarioMock.email } });
    expect(resultado).toEqual(usuarioMock);
  });

  // Retornar usuário existente quando `findUnique` resolve com um objeto
  it('findUnique() deve retornar um usuário existente quando resolve com um objeto', async () => {
    mockFindUnique(prismaService, 'user', usuarioMock, true);

    const resultado = await service.user({ email: usuarioMock.email });

    expect(prismaService.user.findUnique).toHaveBeenCalled();
    expect(resultado).toEqual(usuarioMock);
  });

  it('verificarSeOEmailJaExiste() deve validar e-mail válido e não existente', async () => {
    // Mock do helpers
    MockListarUsuarios(service, []);

    const emailValido = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailValido);
    expect(resultado).toEqual(false);
  });

  it('verificarSeOEmailJaExiste() deve retornar um e-mail existente de outro usuário', async () => {

    // Usa o helper para mockar findMany
    mockFindMany(prismaService, 'user', usuariosMock);

    const emailExistente = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailExistente);

    expect(resultado).toEqual(usuariosMock.at(0));
  });

  it('validarEmail() deve validar e-mail existente para o mesmo usuário (com id)', async () => {
    // Mock do helpers
    MockListarUsuarios(service, usuariosMock);

    const emailExistente = usuarioMock.email as string;
    const resultado = await service.validarEmail(emailExistente, 123);
    expect(resultado).toEqual({ email: emailExistente });
  });

  it('validarEmail() deve retornar mensagem para e-mail inválido', async () => {
    // Mock do helpers
    MockListarUsuarios(service, []);

    const emailInvalido = 'usuarioemailinvalido.com';
    const resultado = await service.validarEmail(emailInvalido);
    expect(resultado).toHaveProperty('message');
  });


  it('validarSenha() deve validar uma senha', async () => {
    const senha = '12345678910';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('hash');
  });

  it('validarSenha() deve retornar uma mensagem para senha inválida', async () => {
    const senha = '1234';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('message');
  });

  it('createUser() deve cadastrar um usuário', async () => {
    MockListarUsuarios(service, []);

    // Mock o método create para retornar o usuário
    jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(usuarioMock as any);

    const resultado = await service.createUser(usuarioMock);

    expect(resultado).toEqual(usuarioMock);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: usuarioMock
    });
  });

  it('createUser() deve retornar uma mensagem em caso de e-mail inválido', async () => {
    jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hash' });
    jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ message: '' });

    const resultado = await service.createUser(usuarioMock);

    expect(resultado).toHaveProperty('message');
  });

  it('createUser() deve retornar uma mensagem para senha inválida', async () => {
    jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ message: '' });
    jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: usuarioMock.email as string });

    const resultado = await service.createUser(usuarioMock);

    expect(resultado).toHaveProperty('message');

  });
});