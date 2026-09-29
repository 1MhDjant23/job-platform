import z from "zod";

export const createJobSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(120, 'Title is too long'),
    
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters.')
        .max(5000, 'Description is too long'),

    location: z
        .string()
        .max(100, 'Location is too long')
        .optional()
        .or(z.literal('')),

    type: z
        .enum(
            ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'],
            { errorMap: () => ({message: 'Select a job type'}) }
        ),

    salaryMax: z
        .number({ invalid_type_error: 'Enter a valid number' })
        .int('Must be a whole number')
        .min(0, 'Cannot be negative')
        .optional(),

    salaryMin: z
        .number({ invalid_type_error: 'Enter a valid number' })
        .int('Must be a whole number')
        .min(0, 'Cannot be negative')
        .optional(),
    
    expiresAt: z
        .string()
        .optional()
        .or(z.literal('')),
})
.refine(
    (data) => {
        if(data.salaryMax !== undefined && data.salaryMin !== undefined) {
            return data.salaryMin <= data.salaryMax;
        }
        return true;
    },
    {
        message: 'Minimum salary cannot exceed maximum',
        path: ['salaryMax'],
    }
)

export  type CreateJobFormData = z.infer<typeof createJobSchema>;