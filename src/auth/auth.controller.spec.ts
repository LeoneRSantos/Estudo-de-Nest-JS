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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
