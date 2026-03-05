import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosControllerController {
    @Get('lista-de-usuarios')
    listarUsuarios() {
        return 'Lista de usuários';
    }
}
