import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get('lista-de-usuarios')
    listarUsuarios(): String {
        return 'Lista de usuários';
    }
}
