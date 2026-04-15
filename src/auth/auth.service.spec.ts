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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
