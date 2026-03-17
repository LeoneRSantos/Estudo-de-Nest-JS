import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        const url = configService.get<string>('DATABASE_URL');

        const adapter = new PrismaBetterSqlite3({ url });
        console.log("Veja:", url);

        super({ adapter });
    }
}

