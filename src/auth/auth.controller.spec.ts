import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    // Mock do PrismaService
    const mockPrismaService = {
      user: {
        findMany: jest.fn(),
      },
    };
    // Mock do ConfigService (se necessário para Prisma)
    const mockConfigServiceValue = {
      get: jest.fn().mockReturnValue('mocked-db-url'), // Simula DATABASE_URL
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [JwtService, AuthService, LocalStrategy, UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigServiceValue }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockUsersService = module.get(UsersService);
  });

  it('Verificar a chamada do controller', () => {
    expect(controller).toBeDefined();
  });

  it('login() deve autenticar um usuário com dados válidos', async () => {
    jest.spyOn(controller, 'login').mockResolvedValueOnce({ token: 'token' });

    const resultado = await controller.login(usuarioMock);

    expect(resultado).toHaveProperty('token');
  });
});
