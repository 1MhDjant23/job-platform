/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type KeyboardEvent } from "react";
import { usePostJob } from "../../hooks/useJobs";
import { useForm } from "react-hook-form";
import { createJobSchema, type CreateJobFormData } from "../../lib/validations/job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";


const JOB_TYPES = [
  { value: 'FULL_TIME',  label: 'Full Time' },
  { value: 'PART_TIME',  label: 'Part Time' },
  { value: 'CONTRACT',   label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE',     label: 'Remote' },
];

export default  function PostJobPage() {
    const   [apiError, setApiError] = useState<string | null>(null);
    const   [tags, setTags] = useState<string[]>([]);
    const   [tagInput, setTagInput] = useState('');

    const   { mutateAsync, isPending } = usePostJob();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateJobFormData>({
        resolver: zodResolver(createJobSchema),
        defaultValues: { type: 'FULL_TIME' }
    })

    // ___ Tag input handler
    function addTag(value: string) {
        const cleaned = value.trim().toLowerCase();

        if(!cleaned || tags.includes(cleaned) || tags.length >= 10)
            return ;
        setTags(prev => [...prev, cleaned]);
        setTagInput('');
    }

    function removeTag(tag: string) {
        setTags(prv => prv.filter(t => t !== tag));
    }

    function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        // add tag on Enter or comma
        if(e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        }
        // removve last tag
        if(e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            setTags(prev => prev.slice(0, -1));
        }
    }
    // form submit
    const   onSubmit = async (formData: CreateJobFormData) => {
        setApiError(null);

        try {
            // if taginput has content but user didn't press enter, i will add it
            const   finalTags = tagInput.trim()
                ? [...tags, tagInput.trim().toLowerCase()]
                : tags;
            
            const payload = {
                title:       formData.title,
                description: formData.description,
                type:        formData.type,
                location:    formData.location     || undefined,
                salaryMin:   formData.salaryMin    ?? undefined,
                salaryMax:   formData.salaryMax    ?? undefined,
                expiresAt:   formData.expiresAt    || undefined,
                tags:        finalTags.length > 0 ? finalTags : undefined,
            };
            await mutateAsync(payload);
            // onSuccess in usePostJob() handle navigation
            
        } catch (error: any) {
            const   message = error.response?.data?.message;
            if(Array.isArray(message)) {
                setApiError(message[0]);
            } else {
                setApiError(message ?? 'Failed to post job');
            }   
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Back link */}
                <Link
                    to={'/dashboard'}
                    className="inline-flex items-center gap-1 text-sm text-gray-500
                     hover:text-gray-900 mb-6 transition-colors"
                >
                    ← Back to dashboard
                </Link>
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Post a new job
                </h1>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {/* api error */}
                    {apiError && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{apiError}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" >
                    {/* title */}
                        <Input
                            label="Job title"
                            type="text"
                            placeholder="Senior developer"
                            error={errors.title?.message}
                            {...register('title')}
                        />
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description * <span className="text-gray-400 font-normal">(min. 50 characters)</span>
                            </label>
                            <textarea
                                {...register('description')}
                                rows={8}
                                placeholder="Describe the role, responsibilities, and requirements..."
                                className={`
                                    w-full px-3 py-2.5 text-sm rounded-lg border outline-none
                                    resize-none transition-colors focus:ring-2 focus:border-transparent
                                    ${errors.description
                                        ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }
                                    `}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">
                                {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* type + location */}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job type *
                                </label>
                                <select
                                    {...register('type')}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300
                                        rounded-lg outline-none bg-white text-gray-700
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {JOB_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.type.message}
                                    </p>
                                )}
                            </div>

                            <Input 
                                label="Location"
                                type="text"
                                {...register('location')}
                                placeholder="Casablanca, Morocco"
                                error={errors.type?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary range <span className="text-gray-400 font-normal">(MAD/month, optional)</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Minimum"
                                        className={`
                                            w-full px-3 py-2.5 text-sm rounded-lg border outline-none
                                            focus:ring-2 focus:border-transparent
                                            ${errors.salaryMin
                                                ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }
                                        `}
                                        {...register('salaryMin', { valueAsNumber: true })}
                                    />
                                    {errors.salaryMin && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.salaryMin.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        placeholder="Maximum"
                                        className={`
                                            w-full px-3 py-2.5 text-sm rounded-lg border outline-none
                                            focus:ring-2 focus:border-transparent
                                            ${errors.salaryMax
                                                ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }
                                        `}
                                        {...register('salaryMax', { valueAsNumber: true })}
                                    />
                                    {errors.salaryMax && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.salaryMax.message}
                                        </p>
                                    )}
                                </div>         
                            </div>
                        </div>

                        {/* tags inpiut */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skills & tags
                                <span className="text-gray-400 font-normal ml-1">
                                    (Press Enter or comma to add, max 10)
                                </span>
                            </label>

                            {/* tag pills + inpit in one box */}
                            <div className={`
                                min-h-44px w-full px-3 py-2 rounded-lg border
                                flex flex-wrap gap-1.5 items-center
                                focus-within:ring-2 focus-within:ring-blue-500
                                focus-within:border-transparent transition-colors
                                border-gray-300 bg-white cursor-text
                            `}>
                            {/* existing tags as pills */}
                                {tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5
                                            bg-blue-100 text-blue-800 text-xs rounded-full
                                            font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-blue-600 hover:text-blue-900
                                                leading-none ml-0.5"    
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}

                                {/* input , grows to fill remaining space */}
                                {tags.length < 10 && (
                                    <input 
                                        type="text"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        onBlur={() => addTag(tagInput)}
                                        // catches when user clicks submit, without pressing Enter first
                                        placeholder={tags.length === 0 ? 'nestJs, react, postgresql...' : ''}
                                        className="flex-1 min-w-120px outline-none text-sm
                                            bg-transparent text-gray-700 placeholder-gray-400"   
                                    />
                                )}
                            </div>
                        </div>

                        {/* expire date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Application deadline
                                <span className="text-gray-400 font-normal ml-1">(optional)</span>
                            </label>
                            <input
                                type="date"
                                {...register('expiresAt')}
                                min={new Date().toISOString().split('T')[0]}
                                // prevent picking a date in the past
                                className="px-3 py-2.5 text-sm border border-gray-300
                                    rounded-lg outline-none focus:ring-2
                                    focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {/* Submit */}
                        <div className="pt-2 flex gap-3">
                            <Button
                                type="submit"
                                isLoading={isPending}
                            >
                                {isPending ? 'Posting...' : 'Post job'}
                            </Button>
                            <Link to={'/dashboard'}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}