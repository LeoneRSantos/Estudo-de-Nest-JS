import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { UserLoginInput } from '../generated/prisma/models';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async buscarUsuarioPorEmail(emailInserido: string) {
        const usuario = await this.prisma.user.findUnique({
            where: { email: emailInserido },
        });
        return usuario ? usuario : null;
    }

    async buscarSenha(senhaInserida: string, senhaArmazenada: string) {
        return await bcrypt.compare(senhaInserida, senhaArmazenada);
    }

    async login(dados: UserLoginInput): Promise<{ message: string } | { token: string }> {
        const usuario = await this.buscarUsuarioPorEmail(dados.email);
        console.log(usuario);

        if (usuario === null) {
            return { message: "Usuário não encontrado" };
        }

        const senhaValida = await this.buscarSenha(dados.password, usuario.password);

        if (!senhaValida) {
            return { message: "Senha inválida" };
        }

        return { token: await this.jwtService.signAsync({ sub: usuario.id, username: usuario.name }) };
    }
}
