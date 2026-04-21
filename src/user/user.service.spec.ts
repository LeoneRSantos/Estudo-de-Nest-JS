import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockPrismaService, mockFindMany, MockListarUsuarios } from '../../test/mocks/prisma-helpers';
import { usuariosMock } from '../../test/mocks/usuarios-helpers';

describe('UserService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock do PrismaService
  const mockPrismaService = createMockPrismaService('user');

  // Mock do ConfigService
  const mockConfigService = {
    get: jest.fn().mockReturnValue('mocked-db-url'),
  };

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

  it('Deve validar e-mail válido e não existente', async () => {
    // Mock do helpers
    MockListarUsuarios(service, []);

    const emailValido = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailValido);
    expect(resultado).toEqual(false);
  });

  it('Deve retornar um e-mail existente de outro usuário', async () => {
    const mockUsers = [
      { id: 1, email: 'usuario@emailvalido.com', name: 'Usuário Teste', password: 'senhadousuarioteste' },
    ];

    // Usa o helper para mockar findMany
    mockFindMany(prismaService, 'user', mockUsers as any);

    const emailExistente = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailExistente);

    expect(resultado).toEqual(mockUsers.at(0));
  });

  it('Deve validar e-mail existente para o mesmo usuário (com id)', async () => {
    // Mock: users retorna usuário com id correspondente
    jest.spyOn(service, 'users').mockResolvedValue([
      { id: 123, email: 'usuario@emailvalido.com', name: "Usuario Teste", password: 'senhadousuarioteste' },
    ]);

    const emailExistente = 'usuario@emailvalido.com';
    const resultado = await service.validarEmail(emailExistente, 123);
    expect(resultado).toEqual({ email: emailExistente });
  });

  it('Deve retornar mensagem para e-mail inválido', async () => {
    // Mock: users retorna lista vazia
    jest.spyOn(service, 'users').mockResolvedValue([]);

    const emailInvalido = 'usuarioemailinvalido.com';
    const resultado = await service.validarEmail(emailInvalido);
    expect(resultado).toHaveProperty('message');
  });


  it('Deve ser possível validar uma senha', async () => {
    const senha = '12345678910';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('hash');
  });

  it('Deve ser possível retornar uma mensagem para senha inválida', async () => {
    const senha = '1234';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('message');
  });
});