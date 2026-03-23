import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { UserLoginInput } from 'src/generated/prisma/models';

@Injectable()
export class AuthService {}
