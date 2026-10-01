import type { Company, JobType } from './index';


export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export  interface Application {
    id:          string;
    status:      ApplicationStatus;
    coverLetter: string | null;
    appliedAt:   string;
    job: {
        id:       string;
        title:    string;
        company:  Company;
        type:     JobType;
        location: string | null;
    };
}