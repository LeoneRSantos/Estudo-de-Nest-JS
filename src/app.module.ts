import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { AppController } from './app/app.controller';
import { UsersService } from './user/user.service';
import { PostsService } from './post/post.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UserController],
})
export class AppModule { }
