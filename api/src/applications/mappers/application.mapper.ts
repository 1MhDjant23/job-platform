import { Prisma } from '@prisma/client';
import type { Application as PublicApplication } from '@job-platform/contracts';

export const publicApplicationSelect = {
    id: true,
    status: true,
    coverLeter: true,
    appliedAt: true,
    job: {
        select: {
            id: true,
            title: true,
            type: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    location: true,
                    website: true,
                    logoUrl: true,
                    ownerId: true,
                },
            },
        },
    },
} satisfies Prisma.ApplicationSelect;

type PublicApplicationSource = Prisma.ApplicationGetPayload<{
    select: typeof publicApplicationSelect;
}>;

const statusMap: Record<string, PublicApplication['status']> = {
    Applied: 'PENDING',
    Reviewd: 'REVIEWED',
    Accepted: 'ACCEPTED',
    Rejected: 'REJECTED',
};

export function toPublicApplication(
    application: PublicApplicationSource,
): PublicApplication {
    return {
        id: application.id,
        status: statusMap[application.status],
        coverLetter: application.coverLeter,
        appliedAt: application.appliedAt.toISOString(),
        job: {
            id: application.job.id,
            title: application.job.title,
            type: application.job.type,
            location: application.job.company.location,
            company: application.job.company,
        },
    };
}