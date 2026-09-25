import { useQuery } from "@tanstack/react-query";
import type { Job, PaginatedResponse } from "../types";
import { api } from "../lib/axios";
// import { URLSearchParams } from "url";


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