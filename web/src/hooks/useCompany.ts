import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";

export interface Company {
    id:          string;
    name:        string;
    description: string | null;
    location:    string | null;
    website:     string | null;
    logoUrl:     string | null;
    ownerId:     string;
}

export interface CreateCompanyDto {
    name:         string;
    description?: string;
    location?:    string;
    website?:     string;
}

//_____ Read my company___
export function useMyCompany() {
    return useQuery({
        queryKey: ['company', 'mine'],
        queryFn: async () => {
            const { data } = await api.get('/companies/mine');
            return data.data as Company;
        },
        retry: false
        // we don't retry on 404 because employer has no company yet
    })
}

// ________ Create company ___________

export function useCreateCompany() {
    const   querClient = useQueryClient(); // to have access to cach
    const   navigate = useNavigate();

    return useMutation({
        mutationFn: async (dto: CreateCompanyDto) => {
            const   { data } = await api.post('/companies', dto);
            return data.data as Company;
        },
        onSuccess: (newCompany) => {

            // Putting the new company directly in cache, no refetch needed
            querClient.setQueryData(['company', 'mine'], newCompany);
            navigate('/dashboard', { replace: true })
        }
    });
}

// ______ Update company _________

export function useUpdateCompany() {
    const   querClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: Partial<CreateCompanyDto>) => {
            const   { data } = await api.patch('/companies', dto);
            return data.data as Company;
        },
        onSuccess: (updated) => {
            querClient.setQueryData(['company', 'mine'], updated);
        },
    });
}