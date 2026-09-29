import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) {}

    async   upsertTags(names: string[]) : Promise<{id: string}[]> {
        if(!names || names.length === 0) {
            return [];
        }
        const   unique = [... new Set(names.map(n => n.toLocaleLowerCase().trim()))];

        await this.prisma.tags.createMany({
            data: unique.map(name => ({name})),
            skipDuplicates: true
        });
        return await this.prisma.tags.findMany({
            where: { name: {in: unique} },
            select: { id: true }
        });
    }
}
