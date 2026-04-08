import { jest } from '@jest/globals';

export const prismaMock = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },

    post: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
};