import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { usuarioInexistente, usuarioMock } from '../../test/mocks/usuarios-helpers';

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

    // Mock para findUnique
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(usuarioMock as any);

    // Mock para bcrypt.compare
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true as any);

    // Mock para jwtService.signAsync
    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('token_mockado');

    const resultado = await service.login({
      email: usuarioMock.email as string,
      password: usuarioMock.password,
    });

    expect(resultado).toHaveProperty('token');
    expect((resultado as { token: string }).token).toBe('token_mockado');
  });

  it('login() deve retornar uma mensagem para usuário não encontrado', async () => {
    jest.spyOn(service, 'buscarUsuarioPorEmail').mockResolvedValueOnce(null);

    const resultado = await service.login({
      email: usuarioMock.email as string,
      password: usuarioMock.password,
    });

    expect(resultado).toHaveProperty('message');
  });

  it('login() deve retornar uma mensagem para senha incorreta', async () => {
    jest.spyOn(service, 'buscarUsuarioPorEmail').mockResolvedValueOnce(usuarioMock);

    jest.spyOn(service, 'buscarSenha').mockResolvedValueOnce(false);

    const resultado = await service.login({
      email: usuarioMock.email,
      password: usuarioMock.password
    });

    expect(resultado).toHaveProperty('message');
  });

  it('Deve retornar que um usuário não foi encontrado', async () => {

    // Mock para findUnique
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

    const resultado = await service.buscarUsuarioPorEmail(usuarioInexistente.email);

    expect(resultado).toBeNull();
  });

  it('Deve retornar um usuário encontrado', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(usuarioMock as any);

    const resultado = await service.buscarUsuarioPorEmail(usuarioMock.email);

    expect(resultado).toBe(usuarioMock);
  });

  it('Deve-se validar uma senha', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(usuarioMock as any);

    // Mock para bcrypt.compare
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true as any);

    const senhaTeste = 'senhadousuarioteste';

    const usuarioDaSenha = await service.buscarUsuarioPorEmail(usuarioMock.email);

    const resultado = await service.buscarSenha(senhaTeste, usuarioDaSenha?.password as string);

    expect(resultado).toBe(true);
  });

  it('Deve-se invalidar uma senha', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(usuarioMock);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false as any);

    const senhaTeste = 'abcdefgh';

    const usuarioDoBD = await service.buscarUsuarioPorEmail(usuarioMock.email);

    const resultado = await service.buscarSenha(senhaTeste, usuarioDoBD?.password as string);

    expect(resultado).toBe(false);
  });

  it('Deve-se retornar uma mensagem para usuário não encontrado', async () => {

    jest.spyOn(service, 'buscarUsuarioPorEmail').mockResolvedValueOnce(null);

    const resultado = await service.login(usuarioInexistente);

    expect(resultado).toHaveProperty('message');
  });

  it('Deve-se retornar uma mensagem para senha incorreta', async () => {
    jest.spyOn(service, 'buscarUsuarioPorEmail').mockResolvedValueOnce(usuarioMock);

    const resultado = await service.login(usuarioInexistente);

    expect(resultado).toHaveProperty('message');
  });

});
