import  { z }   from 'zod';


export  const   loginSchema = z
    .object({
        email: z.string()
                .min(1,'Email is required')
                .email('Enter a valid email address'),
        password:   z.string()
                     .min(1, 'Password is required')
});

// derive type in the schema

export   type LoginFormData = z.infer<typeof loginSchema>;

export  const   registerSchema = z
    .object({
        firstname: z
            .string()
            .min(2, 'First name must be at least 2 characters')
            .max(50, 'First name is too long'),
        lastname: z
            .string()
            .min(2, 'Last name must be at least 2 characters')
            .max(50, 'Last name is too long'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase lettre')
            .regex(/[0-9]/, 'Must contain at least one number'),
        confirmPassword: z 
            .string()
            .min(1, 'Please confirm your password'),
        role: z.enum(['JOB_SEEKER', 'EMPLOYER'], {
            errorMap: () => ({message: 'Please select a role'})
        })
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Password do not match',
            path: ['confirmPassword']
        }
    );

export  type RegisterFormData = z.infer<typeof registerSchema>;
