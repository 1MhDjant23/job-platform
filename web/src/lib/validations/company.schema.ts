import z from "zod";

export const    createCompanySchema = z.object({
    name: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name is too long'),
    description: z
        .string()
        .max(1000, 'Description is too long')
        .optional()
        .or(z.literal('')), //allows empty string
    location: z
        .string()
        .max(100, 'Location is too long')
        .optional()
        .or(z.literal('')),

    website: z
        .string()
        .url('Enter a valid URL (include https://)')
        .optional()
        .or(z.literal(''))
})

export  type CreateCompanyFormData = z.infer<typeof createCompanySchema>;