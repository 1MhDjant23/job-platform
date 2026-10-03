import type { Company as PrismaCompany } from '@prisma/client';
import type { Company as PublicCompany } from '@job-platform/contracts';

export function toPublicCompany(company: PrismaCompany): PublicCompany {
    return {
        id: company.id,
        name: company.name,
        description: company.description,
        location: company.location,
        website: company.website,
        logoUrl: company.logoUrl,
        ownerId: company.ownerId,
    };
}