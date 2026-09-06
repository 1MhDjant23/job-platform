import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor(private readonly configService: ConfigService) {
        const connectionString =
            configService.get<string>('DATABASE_URL');

        if (!connectionString) {
            throw new Error('Missing DATABASE_URL in .env');
        }

        const adapter = new PrismaPg({ connectionString });

        super({ adapter, log: ['error', 'query', 'warn'] });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to PostgreSQL');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected');
    }
}