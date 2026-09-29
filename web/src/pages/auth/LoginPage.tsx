import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
// import { Spinner } from "../../components/ui/Spinner";

export default function LoginPage() {
    
    const   {login, user} = useAuth();
    const   navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate('/', {replace: true})
        }
    }, [user, navigate])


    const   [apiError, setApiError] = useState<string|null>(null);

    const   {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });
    
    const onSubmit = async (payload: LoginFormData) => {
        setApiError(null);

        try {
            await login(payload.email, payload.password);
            navigate('/', { replace: true });
        } catch (error: any) {
            const   message = error.response?.data?.message;
            if (Array.isArray(message)) {
                //validation error from backend
                setApiError(message[0]);
            } else {
                setApiError(message ?? 'Something went wrong. Please try again.');
            }
        }
    }

    // if(isLoading) {
    //     return <Spinner />
    // }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sign in to your account
                    </p>
                </div>
                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{apiError}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" >
                    {/* noValidate disable browser native validation, leting zod doit */}
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
                        autoComplete="current-password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="mt-2"
                        >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                {/* Lik to register */}
                <p className="text-sm text-center text-gray-500 mt-6" >
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                        >
                        Create One
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}