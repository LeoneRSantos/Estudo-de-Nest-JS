import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService]
})
export class AuthModule {}
