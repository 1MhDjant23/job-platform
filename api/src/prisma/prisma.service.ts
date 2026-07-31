import { OnModuleDestroy, OnModuleInit, Logger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export  class   PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly configService: ConfigService) {
        const   adapter = new PrismaPg({ connectionString: configService.get("DATABASE_URL") });
        super({ adapter: adapter, log: ["error", "query", "warn"] })
    }    
    private readonly logger = new Logger();
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to PostgreSQL');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected');
    }
}