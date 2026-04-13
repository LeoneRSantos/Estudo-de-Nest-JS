import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UsersService } from '../user/user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { PostsService } from '../post/post.service';

describe('AppController', () => {
  let controller: AppController;

  // Mock do PrismaService
  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        UsersService,
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
