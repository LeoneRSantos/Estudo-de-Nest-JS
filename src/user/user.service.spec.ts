import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock do PrismaService
  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
    },
  };

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

  it('Deve validar e-mail válido e não existente', async () => {
    // Mock: users retorna lista vazia (e-mail não existe)
    jest.spyOn(service, 'users').mockResolvedValue([]);

    const emailValido = 'usuario@emailvalido.com';
    const resultado = await service.validarEmail(emailValido);
    expect(resultado).toEqual({ email: emailValido });
  });

  it('Deve retornar mensagem para e-mail existente de outro usuário', async () => {
    const mockUsers = [
      { id: 1, email: 'usuario@emailvalido.com', name: 'Usuário Teste', password: 'senhadousuarioteste' },
    ];

    // Mock direto no PrismaService
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValueOnce(mockUsers as any);

    const emailExistente = 'usuario@emailvalido.com';
    const resultado = await service.validarEmail(emailExistente);
    console.log(resultado);

    expect(resultado).toEqual({ message: "Este email já pertence a outro usuário." });
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
    expect(resultado).toEqual({ message: 'Email inválido' });
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