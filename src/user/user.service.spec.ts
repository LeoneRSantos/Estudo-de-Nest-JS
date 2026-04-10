import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../generated/prisma/client';

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
  });


  it('Deve ser possível validar uma senha', async () => {
    const senha = "12345678910";
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('hash');
  });

  it('Deve ser possível retornar uma mensagem para senha inválida', async () => {
    const senha = "1234";
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('message');
  })
});
