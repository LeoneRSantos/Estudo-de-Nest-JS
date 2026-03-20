
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { User, Prisma } from '../generated/prisma/client';

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

    async createUser(data: Prisma.UserCreateInput): Promise<User | { message: string }> {

        const hash = await bcrypt.hash(data.password, 10);
        const evalida = await bcrypt.compare(data.password, hash);
        const listadeUsuarios = await this.users({});
        const emailExiste = listadeUsuarios.some(user => user.email === data.email);

        if (evalida) {
            try {
                if (emailExiste) {
                    throw new InternalServerErrorException("Email já cadastrado");
                }
                data.password = hash;
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
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        });
    }
}

