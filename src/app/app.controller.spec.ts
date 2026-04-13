import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UsersService } from '../user/user.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { PostsService } from '../post/post.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
