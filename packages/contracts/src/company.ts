
export interface CreateCompany {
    id:      string;
    name:    string;
    logoUrl: string | null;
    location: string | null;
}

export interface Company {
    id:          string;
    name:        string;
    description: string | null;
    location:    string | null;
    website:     string | null;
    logoUrl:     string | null;
    ownerId:     string;
}

