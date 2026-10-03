import { Prisma } from '@prisma/client';
import type { Job as PublicJob } from '@job-platform/contracts';

export const publicJobSelect = {
    id: true,
    title: true,
    description: true,
    salaryMin: true,
    salaryMax: true,
    createdAt: true,
    status: true,
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
    tags: {
        select: {
            tag: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
    _count: {
        select: {
            applicants: true,
        },
    },
} satisfies Prisma.JobsSelect;

type PublicJobSource = Prisma.JobsGetPayload<{
    select: typeof publicJobSelect;
}>;

export function toPublicJob(job: PublicJobSource): PublicJob {
    return {
        id: job.id,
        title: job.title,
        description: job.description,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        location: job.company.location,
        type: job.type,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
        company: job.company,
        tags: job.tags,
        _count: {
            applications: job._count.applicants,
        },
    };
}