import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../user.service';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockPrismaService, mockConfigService, MockListarUsuarios } from '../../../../test/mocks/prisma-helpers';
import { usuarioMock } from '../../../../test/mocks/usuarios-helpers';
import { InternalServerErrorException } from '@nestjs/common';

/**
 * 
### 4. `deleteUser()`
- deletar com sucesso
  - mockar `prisma.user.delete` e verificar retorno `UserDeletedOutput`
- passar `where` vazio / `undefined`
  - esperar `InternalServerErrorException`
- erro interno do Prisma
  - mockar `prisma.user.delete` para lançar
  - esperar `InternalServerErrorException`

### 5. `createUser()` (casos extras)
- garantir retorno de mensagem genérica quando `prisma.user.create` lança
- já há testes para senha inválida e email inválido, mas falta cobertura de exceção de persistência
 */

describe('Testes de CRUD de UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    const usuarioAtualizado = {
        ...usuarioMock,
        password: 'hashedPassword',
        email: 'novoemail@email.com'
    };

    // Mock do PrismaService
    const mockPrismaService = createMockPrismaService('user');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpa mocks entre testes
    });

    it('createUser() deve cadastrar um usuário', async () => {
        MockListarUsuarios(service, []);

        // Mock o método create para retornar o usuário
        jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(usuarioMock as any);

        const resultado = await service.createUser(usuarioMock);

        expect(resultado).toEqual(usuarioMock);
        expect(prismaService.user.create).toHaveBeenCalledWith({
            data: usuarioMock
        });
    });

    it('createUser() deve retornar uma mensagem em caso de e-mail inválido', async () => {
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hash' });
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ message: '' });

        const resultado = await service.createUser(usuarioMock);

        expect(resultado).toHaveProperty('message');
    });

    it('createUser() deve retornar uma mensagem para senha inválida', async () => {
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ message: '' });
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: usuarioMock.email as string });

        const resultado = await service.createUser(usuarioMock);

        expect(resultado).toHaveProperty('message');

    });

    it('updateUser() deve atualizar o email do usuário', async () => {
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: 'novoemail@email.com' });
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hashedPassword' });

        jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(usuarioAtualizado as any);

        const resultado = await service.updateUser({ where: { id: usuarioMock.id }, data: usuarioAtualizado });

        expect(resultado.email).toEqual('novoemail@email.com');
    });

    it('updateUser() deve atualizar a senha de um usuário', async () => {
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: usuarioAtualizado.email });
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hashedPassword' });

        jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(usuarioAtualizado as any);

        const resultado = await service.updateUser({ where: { id: usuarioMock.id }, data: usuarioAtualizado });

        expect(resultado.password).toEqual('hashedPassword');
    });

    it('updateUser() deve atualizar o nome de um usuário', async () => {
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: 'email' });
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hash' });

        const nome = "novo nome";
        jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce({ ...usuarioAtualizado, name: nome });

        const resultado = await service.updateUser({ where: { id: usuarioMock.id }, data: { ...usuarioAtualizado, name: nome } });

        expect(resultado.name).toEqual(nome);
    });

    it('updateUser() deve lançar exceção de email inválido', async () => {
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ message: 'email' });
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ hash: 'hashedPassword' });

        // No caso do rejects, o método precisa ser lançado junto com o expect
        await expect(
            service.updateUser({ where: { id: usuarioMock.id }, data: usuarioMock })
        ).rejects.toThrow(InternalServerErrorException);
    });

    it('updateUser() deve lançar uma exceção para senha inválida', async () => {
        jest.spyOn(service, 'validarEmail').mockResolvedValueOnce({ email: usuarioMock.email });
        jest.spyOn(service, 'validarSenha').mockResolvedValueOnce({ message: '' });

        await expect(service.updateUser({ where: { id: usuarioMock.id }, data: usuarioMock })).rejects.toThrow(InternalServerErrorException);
    });
})