import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PostsService]
})
export class PostModule { }
