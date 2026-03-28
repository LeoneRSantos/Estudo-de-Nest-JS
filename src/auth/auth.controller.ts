import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginInput } from 'src/generated/prisma/models';
import { AuthGuard } from './auth.guard';
import { LocalAuthGuard } from './passport.local.guard';
import { LocalStrategy } from './local.strategy';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService, private passportLocal: LocalStrategy) { }

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

    // Login com Passport
    @Post('login-passport')
    async loginPassport(@Body() dadosEnviados: UserLoginInput) {
        return this.passportLocal.validate(dadosEnviados);
    }

    // Logout com Passport
    @UseGuards(LocalAuthGuard)
    @Post('logout-passport')
    async logoutPassport(@Request() req) {
        return req.logout();
    }


}
