import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Application } from "@job-platform/contracts";

// fetch my application
export  function useMyApplications() {
    return useQuery({
        queryKey: ['applications', 'mine'],
        queryFn: async () => {
            const   { data } = await api.get('/applications/mine');
            return data.data as Application[];
        }
    })
}

// apply to a job

export  function useApply() {
    const   queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: { jobId: string, coverLetter?: string }) => {
            const {data} = await api.post('/applications', dto);
            return data.data as Application;
        },
        onSuccess: () => {
            // invalidate applications list, new one added
            queryClient.invalidateQueries({ queryKey: ['applications/mine']});
            // also invalidate job because _count.application chnaged
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    })
}

// withdraw application

export function useWithdrawApplication() {
    const   queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/applications/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    });

}