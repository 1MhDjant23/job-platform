import { useState } from "react";
import { useCreateCompany } from "../../hooks/useCompany";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, type CreateCompanyFormData } from "../../lib/validations/company.schema";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";


export  function SetupCompanyPage(){
    const   [apiError, setApiError] = useState<string | null>();
    const  { mutateAsync, isPending } = useCreateCompany();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateCompanyFormData>({
        resolver: zodResolver(createCompanySchema)
    })

    const   onSubmit = async (formData: CreateCompanyFormData) => {
        setApiError(null);

        try {
            // strip empty string, send undefined instead
            // because in backend DTO use @IsOptional() ; undefined is fine but '' is not
            const   payload = {
                name: formData.name,
                description: formData.description || undefined,
                location: formData.location || undefined,
                website: formData.website || undefined
            };
            await mutateAsync(payload);
            // on success, useCreateCompany handle navgation to dashboerd
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const   message = err.response?.data?.message;
            if(Array.isArray(message)) {
                setApiError(message[0]);
            } else {
                setApiError(message ?? 'Failed to create company');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
            {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Setup your company
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        This informations will appear on your job listings
                    </p>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                    {/* API error */}
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" >
                        {/* required field */}
                        <Input
                            label="Company name *"
                            type="text"
                            placeholder="Acme Corp"
                            error={errors.name?.message}
                            { ...register('name') }
                        />
                        {/* optional field  */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" >
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="Tell candidates about your company..."
                                className="w-full px-3 py-2.5 text-sm rounded-lg border
                                    border-gray-300 outline-none resize-none
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.description && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Location"
                                type="text"
                                placeholder="Casablanca, Morocco"
                                error={errors.location?.message}
                                {...register('location')}
                            />
                            <Input
                                label="Website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                error={errors.website?.message}
                                {...register('website')}
                            />
                        </div>

                        <Button
                            type="submit"
                            isLoading={isPending}
                            className="mt-2"
                        >
                            {isPending ? 'Creating...' : 'Create company profile'}
                        </Button>
                    </form>
                </div>

                {/* Skip option, employer can set up company later */}
                <p className="text-center text-sm text-gray-400 mt-4">
                    You can update this information later from your dashboard
                </p>

            </div>
        </div>
    );
}