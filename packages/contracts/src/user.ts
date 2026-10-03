export type ROLE =  'Employer' | 'JobSeeker' | 'Admin' | 'Public';

export  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: ROLE
    avatarUrl: string | null
    resumeUrl: string | null
}
