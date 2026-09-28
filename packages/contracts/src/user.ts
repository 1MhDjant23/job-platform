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
