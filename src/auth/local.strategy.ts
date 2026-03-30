
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private jwtService: JwtService, private prisma: PrismaService) {
        super();
    }


    async validate(dados: { email: string, password: string }): Promise<{
        message: string
    } | { token: string }> {

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
        const payload = { username: usuario.email, sub: usuario.id };

        return { token: await this.jwtService.sign(payload) };
    }
}
