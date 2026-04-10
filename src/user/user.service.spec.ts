import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../generated/prisma/client';

describe('UserService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, ConfigService],
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
