import { Body, Controller, Get } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/generated/prisma/models';
import { UsersService } from './user.service';

@Controller('usuario')
export class UserController {
    constructor(
        private readonly userService: UsersService
    ) { }

    @Get('criptografia-teste')
    async encpritacaoTeste(@Body() dado: { senha: string },): Promise<any> {
        const { senha } = dado;
        const hash = await bcrypt.hash(senha, 10);
        const evalida = await bcrypt.compare(senha, hash);
        return { senha, hash, evalida };
    }


    @Get('lista-de-usuarios')
    listarUsuarios(): String {
        return 'Lista de usuários';
    }
}
