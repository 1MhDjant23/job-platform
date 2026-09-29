import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Job, PaginatedResponse } from "@job-platform/contracts";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import type { CreateJobFormData } from "../lib/validations/job.schema";


export interface JobFilters {
  page?:      number;
  limit?:     number;
  search?:    string;
  type?:      string;
  location?:  string;
  salaryMin?: number;
  salaryMax?: number;
  tags?:      string;
}

// ________________________ These for AllJobs
async function fetchJobs(filters: JobFilters) : Promise<PaginatedResponse<Job>> {

    const   params = new URLSearchParams();
    if(filters.page)    params.set('page', String(filters.page));
    if(filters.limit)   params.set('limit', String(filters.limit));
    if(filters.search)  params.set('search', String(filters.search));
    if(filters.type)    params.set('type', String(filters.type));
    if(filters.location)    params.set('location', String(filters.location));
    if(filters.salaryMax)   params.set('salaryMax', String(filters.salaryMax));
    if(filters.salaryMin)   params.set('salaryMin', String(filters.salaryMin));
    if(filters.tags)   params.set('tags', String(filters.tags));

    const   { data } = await api.get(`/jobs/${params.toString()}`);
    console.log('Error in use Jobs: ', data);
    // data = { data: Job[], meta: { total, page, limit, totalPages } }
    return data;
}


export  function useJobs(filters: JobFilters = {}) {
    return useQuery({
        queryKey: ['jobs', filters],
        // every filter change = new key = refetch automatique
        queryFn: () => fetchJobs(filters),
        placeholderData: (prev) => prev
    //  keep previous page visible while next page loads
    // prevents content flash between page changes
    })
}

// ___________________ For Job/:id

async function fetchJob(id: string) : Promise<Job> {
    const   { data } = await api.get(`/jobs/${id}`);
    return data.data;
}

export  function useJob(id: string | undefined) {

    return useQuery({
        queryKey: ['job', id],
        queryFn: () => fetchJob(id!),
        enabled: !!id, // don't fetch if id = undefined
        staleTime: 1000 * 60 * 5
    })
}

// ___________ For Dashboard

export  function useMyJobs() {
    return useQuery({
        queryKey: ['jobs', 'mine'],
        queryFn: async () => {
            const   { data } = await api.get('/jobs/mine');
            return data.data as Job[];
        }
    })
}

export  function  useDeleteJob() {
    const   queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            api.delete(`/jobs/${id}`).then(r => r.data),
        onSuccess: () => {
            // invalidating both, public lists and employer list
            queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] });
            queryClient.invalidateQueries( {queryKey: ['jobs']} );
        }
    })
}

export function usePostJob() {
    const   queryClient = useQueryClient();
    const   navigate = useNavigate();

    return useMutation({
        mutationFn: async (dto: CreateJobFormData) => {
            const   { data } = await api.post('/jobs', dto);
            return data.data as Job;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            navigate('/dashboard');
        }
    });
}