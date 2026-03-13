import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PostsService]
})
export class PostModule { }
