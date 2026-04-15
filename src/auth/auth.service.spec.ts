import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // Mock do bcrypt
  jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true),
  }));

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn<Promise<any>, [any]>(),
    },
  };


  // Mock do ConfigService
  const mockConfigService = {
    get: jest.fn().mockReturnValue('mocked-db-url'),
  };

  // Mock do JwtService
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService, LocalStrategy, ConfigService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre testes
  });

  it('Deve chamar o método', () => {
    expect(service).toBeDefined();
  });

  it('Deve retornar um token de autenticação válido', async () => {
    const usuarioMock = {
      id: 1,
      email: 'usuario@emailvalido.com',
      name: 'Usuário Teste',
      password: 'senhadousuarioteste',
    };

    // Mock para findUnique
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(usuarioMock as any);

    // Mock para bcrypt.compare (ajuste para evitar redefinição)
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true as any);

    // Mock para jwtService.signAsync
    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('token_mockado');

    const resultado = await service.login({
      email: usuarioMock.email,
      password: usuarioMock.password,
    });

    expect(resultado).toHaveProperty('token');
    expect((resultado as { token: string }).token).toBe('token_mockado');
  });

});
