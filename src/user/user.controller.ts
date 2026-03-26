import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
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
    async listarUsuarios(): Promise<UserModel[]> {
        return this.userService.users({});
    }

    @Put('atualizar-usuario/:id')
    async atualizarUsuario(@Param('id') id: string, @Body() dados: { name: string, email: string, password: string }): Promise<UserModel> {
        return this.userService.updateUser({ where: { id: Number(id) }, data: dados });
    }
}
