import { Body, Controller, Get } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Controller('usuario')
export class UserController {
    @Get('lista-de-usuarios')
    listarUsuarios(): String {
        return 'Lista de usuários';
    }
}
