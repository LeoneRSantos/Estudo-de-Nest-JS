/**
 * Helpers para criar mocks reutilizáveis do PrismaService
 * Centraliza a lógica de mock para evitar repetição em testes
 */

import { PrismaService } from '../../src/database/prisma/prisma.service';

/**
 * Cria um mock básico do PrismaService com métodos findMany
 */
export function createMockPrismaService(entity: 'user' | 'post' = 'user') {
    return {
        [entity]: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
}

/**
 * Configura um mock para findMany
 * @param prismaService - A instância do serviço mockado
 * @param entity - Nome da entidade (user, post, etc)
 * @param data - Os dados que serão retornados
 * @param useOnce - Se true, usa mockResolvedValueOnce; se false, usa mockResolvedValue
 */
export function mockFindMany(
    prismaService: any,
    entity: string,
    data: any[],
    useOnce: boolean = true,
) {
    const method = useOnce ? 'mockResolvedValueOnce' : 'mockResolvedValue';
    return jest
        .spyOn(prismaService[entity], 'findMany')
    [method](data);
}

/**
 * Configura um mock para findUnique
 * @param prismaService - A instância do serviço mockado
 * @param entity - Nome da entidade (user, post, etc)
 * @param data - O dado que será retornado
 * @param useOnce - Se true, usa mockResolvedValueOnce; se false, usa mockResolvedValue
 */
export function mockFindUnique(
    prismaService: any,
    entity: string,
    data: any,
    useOnce: boolean = true,
) {
    const method = useOnce ? 'mockResolvedValueOnce' : 'mockResolvedValue';
    return jest
        .spyOn(prismaService[entity], 'findUnique')
    [method](data);
}

/**
 * Configura um mock para create
 * @param prismaService - A instância do serviço mockado
 * @param entity - Nome da entidade (user, post, etc)
 * @param data - O dado que será retornado
 */
export function mockCreate(
    prismaService: any,
    entity: string,
    data: any,
) {
    return jest
        .spyOn(prismaService[entity], 'create')
        .mockResolvedValueOnce(data);
}

/**
 * Configura um mock para update
 * @param prismaService - A instância do serviço mockado
 * @param entity - Nome da entidade (user, post, etc)
 * @param data - O dado que será retornado
 */
export function mockUpdate(
    prismaService: any,
    entity: string,
    data: any,
) {
    return jest
        .spyOn(prismaService[entity], 'update')
        .mockResolvedValueOnce(data);
}

/**
 * Configura um mock para delete
 * @param prismaService - A instância do serviço mockado
 * @param entity - Nome da entidade (user, post, etc)
 * @param data - O dado que será retornado
 */
export function mockDelete(
    prismaService: any,
    entity: string,
    data: any,
) {
    return jest
        .spyOn(prismaService[entity], 'delete')
        .mockResolvedValueOnce(data);
}


/**
 * Configura um mock para retornar a lista de usuários
 * @param servico - serviço a ser utilizado para acessar o método
 * @param listaSimulada - lista simulada, que pode ser retornada vazia ou com um usuário
 */
export function MockListarUsuarios(
    servico: any,
    listaSimulada: any
) {
    return jest.spyOn(servico, 'users').mockResolvedValueOnce(listaSimulada);
}