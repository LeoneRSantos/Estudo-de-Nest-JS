import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginInput } from 'src/generated/prisma/models';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dadosEnviados: UserLoginInput) {
        return this.auth.login(dadosEnviados);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
