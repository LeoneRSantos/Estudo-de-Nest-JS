
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { User, Prisma } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { UserDeletedOutput } from '../generated/prisma/models';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async validarSenha(senha: string): Promise<{ hash: string } | { message: string }> {
        if (senha.length >= 6) {
            const hash = await bcrypt.hash(senha, 10);

            return { hash };
        }
        return { message: "Senha inválida" };
    }

    async verificarSeOEmailJaExiste(emailaprocurar: string): Promise<User | boolean> {
        const listadeUsuarios = await this.users({});
        const emailExiste = listadeUsuarios.find(user => user.email === emailaprocurar);

        if (emailExiste) {
            return emailExiste;
        }
        return false;
    }

    async validarEmail(emailRecebido: string, id?: number): Promise<{ email: string } | { message: string }> {

        const alguemjatemesseamail = await this.verificarSeOEmailJaExiste(emailRecebido);
        if (alguemjatemesseamail && typeof alguemjatemesseamail === 'object') {
            if (alguemjatemesseamail.id === id) {
                return { email: emailRecebido };
            }
        }

        if (!emailRecebido.includes('@')) {

            return { message: "Email inválido" };
        }
        return { email: emailRecebido };
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User | { message: string }> {

        const evalida = await this.validarSenha(data.password);
        // const evalida = await bcrypt.compare(data.password, hash);
        const emailExiste = await this.validarEmail(data.email);

        if ("hash" in evalida) {
            try {
                if ("message" in emailExiste) {
                    throw new InternalServerErrorException(emailExiste.message);

                }
                data.password = evalida.hash;
                return this.prisma.user.create({
                    data,
                });
            } catch (error) {
                return { message: "Erro ao criar o usuário" };
            }

        } else {

            return { message: "Senha invalida" };
        }
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        const emailAVerificar = await this.validarEmail(data.email as string, Number(where.id));
        const senhaAVerificar = await this.validarSenha(data.password as string);
        if ("message" in senhaAVerificar) {
            throw new InternalServerErrorException(senhaAVerificar.message);
        }
        if ("message" in emailAVerificar) {
            throw new InternalServerErrorException(emailAVerificar.message);
        }
        data.email = emailAVerificar.email;
        data.password = senhaAVerificar.hash;


        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserDeletedOutput> {
        if (!where) {
            throw new InternalServerErrorException("O ID do usuário não foi identificado.");
        }
        try {
            const usuarioDeletado = await this.prisma.user.delete({
                where,
            })
            return {
                id: usuarioDeletado.id,
                name: usuarioDeletado.name,
                email: usuarioDeletado.email
            };
        } catch (InternalServerError) {
            throw new InternalServerErrorException("Erro ao deletar o usuário");
        }
        ;
    }
}

