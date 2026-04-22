import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PostsService } from './post.service';
import { createMockPrismaService, mockConfigService } from '../../test/mocks/prisma-helpers';
import { PrismaService } from '../database/prisma/prisma.service';

describe('PostService', () => {
  let service: PostsService;
  const mockPrismaService = createMockPrismaService('post');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('Deve-se definir o serviço', () => {
    expect(service).toBeDefined();
  });
});
