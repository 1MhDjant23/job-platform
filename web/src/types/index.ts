
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

// Jobs

export  type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export  type JobStatus = 'CLOSED' | 'OPEN' | 'EXPIRED' | 'DRAFT';
export  interface Tag {
    id: string,
    name: string
}

export interface Company {
  id:      string;
  name:    string;
  logoUrl: string | null;
  location: string | null;
}

export interface Job {
  id:          string;
  title:       string;
  description: string;
  salaryMin:   number | null;
  salaryMax:   number | null;
  location:    string | null;
  type:        JobType;
  status:      JobStatus;
  createdAt:   string;
  company:     Company;
  tags:        { tag: Tag }[];  
  _count:      { applications: number };
}