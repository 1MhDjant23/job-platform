import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "../../lib/validations/auth.schema";
import { useAuth } from "../../contexts/auth/AuthContext";
import type { RegisterPayload } from "../../contexts/auth/AuthProvider";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const   ROLE_OPTIONS = [
    {
        value: 'JOB_SEEKER' as const,
        label: 'I\'m looking for a job',
        description: 'Browse and apply to positions' 
    },
    {
        value: 'EMPLOYER' as string,
        label: 'I\'m hiring',
        description: 'Post jobs and find candidates'
    }
]


export function RegisterPage() {

    const   { register: registerUser, user } = useAuth();

    const   [apiError, setApiError] = useState<string|null>(null);
    const   navigate = useNavigate();

    // if already logged-in -> redirect to '/'
    useEffect(() => {
        if(user) {
            navigate('/', {replace: true})
        }
    }, [user, navigate])



    const   {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'JOB_SEEKER' }
    });

    const   selectedRole = watch('role');



    // handle onSubmit
    const onSubmit = async (data: RegisterPayload) => {
        setApiError(null);

        try {
            // strip confirmPassword from data object
            const   {confirmPassword, ...payload} = data;


            await registerUser(payload);

            if(data.role === 'EMPLOYER') {
                navigate('/setup-company', {replace: true});
            } else {
                navigate('/', {replace: true})
            }
            console.log("regstered successfully");
            
        } catch (error: any) {
            const   message = error.response?.data?.message;
            if(Array.isArray(message)) {
                setApiError(message[0]);
            } else {
                setApiError(message ?? 'Registration failed. Please try again.');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create your account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Join thousands of professionals
                </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {/* Api-error */}
                {apiError && 
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{apiError}</p>
                    </div>
                }
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" >
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        I want to
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLE_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className={`
                                    relative flex flex-col p-4 rounded-lg border-2
                                    cursor-pointer transition-colors duration-150
                                    ${selectedRole === option.value
                                        ? 'border-blue-500 bg-blue-50'  // selected
                                        : 'border-gray-200 hover:border-gray-300'
                                    }
                                    `}
                            >
                            <input
                                type="radio"
                                value={option.value}
                                className="sr-only" // visualy hidden but still accessible
                                {...register('role')}
                            />
                            <span className="text-sm font-medium text-gray-900">
                                    {option.label}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                {option.description}
                            </span>
                            </label>
                        ))}
                    </div>
                        {/* Role error, only shows if neither is selected */}
                        {errors.role && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.role.message}
                            </p>
                            )
                        }
                </div>
                {/* Name fields side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        type="text"
                        label="First name"
                        autoComplete="given-name"
                        placeholder="Mohamed"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <Input
                        type="text"
                        label="Last name"
                        autoComplete="family-name"
                        placeholder="Ait Tajante"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>
                <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
                />

                <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register('password')}
                />

                <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                />
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="mt-2"
                >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
            </form>
            {/* Link to login */}
            <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account?{' '}
                <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
                >
                Sign in
                </Link>
            </p>
            </div>
            </div>
        </div>
    );
}