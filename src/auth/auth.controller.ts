import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginInput } from 'src/generated/prisma/models';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    async login(@Body() dadosEnviados: UserLoginInput) {
        return this.auth.login(dadosEnviados);
    }
}
