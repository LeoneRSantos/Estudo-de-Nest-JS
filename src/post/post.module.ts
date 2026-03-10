import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { PostService } from './post.service';
import { PostService } from './post/post.service';

@Module({
  providers: [PostService]
})
export class PostModule {}
