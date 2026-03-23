import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginInput } from 'src/generated/prisma/models';

@Controller('auth')
export class AuthController {}
