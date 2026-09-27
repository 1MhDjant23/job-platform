import { JobStatus, JobType } from "@prisma/client";

export interface Job {
    id: string;
    title: string;
    salaryMin: number | null;
    salaryMax: number | null;
    status: JobStatus;
    type: JobType;
    createdAt: Date;
    company: {
        id: string;
        name: string;
        location: string | null;
        logoUrl: string | null;
    };
}