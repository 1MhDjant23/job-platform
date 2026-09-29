import { Company } from "./company";

export  type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export  type JobStatus = 'CLOSED' | 'OPEN' | 'EXPIRED' | 'DRAFT';
export  interface Tag {
    id: string,
    name: string
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