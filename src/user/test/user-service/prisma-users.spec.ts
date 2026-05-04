import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../user.service';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockPrismaService, mockConfigService, mockFindMany, mockFindUnique } from '../../../../test/mocks/prisma-helpers';
import { usuarioInexistente, usuarioMock, usuariosMock } from '../../../../test/mocks/usuarios-helpers';

describe('Testes de métodos do Prisma para UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

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

    // verificar se o método chama `prisma.user.findUnique` com o `where` correto
    it('O findUnique do Prisma precisa ser chamado com o parâmetro certo', async () => {
        mockFindUnique(prismaService, 'user', usuarioMock);

        const resultado = await service.user({ email: usuarioMock.email });

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: usuarioMock.email } });
        expect(resultado).toEqual(usuarioMock);
    });
    // Definir o serviço
    it('PrismaService deve ser definido', async () => {
        expect(prismaService).toBeDefined();
    });

    // Retornar usuário existente quando `findUnique` resolve com um objeto
    it('findUnique() deve retornar um usuário existente quando resolve com um objeto', async () => {
        mockFindUnique(prismaService, 'user', usuarioMock, true);

        const resultado = await service.user({ email: usuarioMock.email });

        expect(prismaService.user.findUnique).toHaveBeenCalled();
        expect(resultado).toEqual(usuarioMock);
    });

    // Retornar `null` quando `findUnique` resolve com `null`
    it('findUnique() precisa retornar null quando findUnique() não encontra usuário', async () => {
        mockFindUnique(prismaService, 'user', null, true);

        const email = usuarioInexistente.email as string;

        const resultado = await service.user({ email: email });

        expect(prismaService.user.findUnique).toHaveBeenCalled();
        expect(resultado).toBeNull();
    });

    // findMany() retornar os usuários corretamente
    it('findMany() deve retorar os usuários corretamente', async () => {
        mockFindMany(prismaService, 'user', usuariosMock, true);

        const resultado = await prismaService.user.findMany();

        expect(resultado).toEqual(usuariosMock);
    });
});