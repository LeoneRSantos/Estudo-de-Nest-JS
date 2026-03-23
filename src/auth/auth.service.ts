import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { UserLoginInput } from 'src/generated/prisma/models';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async login(dados: UserLoginInput): Promise<{ message: string } | { token: string }> {
        const usuario = await this.prisma.user.findUnique({
            where: { email: dados.email },
        });
        if (!usuario) {
            return { message: "Usuário não encontrado" };
        }
        const senhaHash = await bcrypt.compare(dados.password, usuario.password);

        if (senhaHash) {
            const senhaValida = await this.prisma.user.findFirst({
                where: { email: dados.email, password: usuario.password },
            });

            return { token: `Usuário ${senhaValida?.name} autenticado com sucesso! \n${JSON.stringify(senhaValida)}` };

        }

        if (!senhaHash) {
            return { message: "Senha inválida" };
        }

        return { token: "Usuário autenticado com sucesso." };

    }
}
