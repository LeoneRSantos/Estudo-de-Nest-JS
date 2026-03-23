import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginInput } from 'src/generated/prisma/models';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    async login(@Body() dadosEnviados: UserLoginInput) {
        return this.auth.login(dadosEnviados);
    }
}
