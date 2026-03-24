import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { UserLoginInput } from 'src/generated/prisma/models';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(dados: UserLoginInput): Promise<{ message: string } | { token: string }> {
        const usuario = await this.prisma.user.findUnique({
            where: { email: dados.email },
        });

        if (!usuario) {
            return { message: "Usuário não encontrado" };
        }

        const senhaValida = await bcrypt.compare(dados.password, usuario.password);

        if (!senhaValida) {
            return { message: "Senha inválida" };
        }

        const payload = { sub: usuario.id, username: usuario.name };
        return { token: await this.jwtService.signAsync(payload) };
    }
}
