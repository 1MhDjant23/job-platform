
export  interface User {
    id: string
    email: string
    firstname: string
    lastname: string
    role: ROLE
    avatarUrl: string | null
    resumeUrl: string
}

export type ROLE = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';

export  interface ApiResponse<T> {
    data: T;
}

export  interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number
    }
}