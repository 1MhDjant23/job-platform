/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Job } from "@job-platform/contracts";
import { useState } from "react";
import { useApply } from "../../hooks/useApplication";
import { Button } from "../ui/Button";

interface Props {
    job: Job,
    onClose: () => void
}

export  function    ApplyModal({ job, onClose } : Props) {
    const   [coverLetter, setCoverLetter] = useState<string>('');
    const   [apiError, setApiError] = useState<string | null>(null);
    const   [success, setSuccess] = useState<boolean>(false);

    const   { mutateAsync, isPending } = useApply();

    const   handleSubmit = async () => {
        setApiError(null);

        try {
            await mutateAsync({
                jobId: job.id,
                coverLetter: coverLetter.trim() || undefined
            });
            setSuccess(true);
        } catch (error: any) {
            const   message = error.response?.data?.message;
            // 409 = already applied
            if(error.response?.status === 409) {
                setApiError('You have already applied to this job');
            } else {
                setApiError(message ?? 'Failed to submit application');
            }
        }
    }
    return (
        // backdrop
        <div
            className="fixed inset-0 bg-black/50 flex items-center
                 justify-center z-50 p-4"
            onClick={(e) => {
                //close when clicking backdrop, not the modal itself
                if(e.currentTarget === e.target)    onClose();
            }}
        >
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
            {/* success state */}
                {success ? (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-3">🎉</div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            Application submitted!
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                            You've applied to <span className="font-medium">{job.title}</span> at{' '}
                            <span className="font-medium">{job.company.name}</span>
                            Good luck!
                        </p>
                        <Button onClick={onClose}>
                            Done
                        </Button>
                    </div>
                    ) : (
                        <>
                        {/* header */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Apply to {job.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {job.company.name}
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600
                                    transition-colors text-xl leading-none">
                                    ×
                                </button>
                            </div>
                            {/* api error */}
                            {apiError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{apiError}</p>
                              </div>
                            )}
                            {/* cover letter  */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover letter
                                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                    rows={5}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border
                                        border-gray-300 outline-none resize-none
                                        focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    placeholder="Tell the employer why you're a great fit..."
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {coverLetter.length} / 2000
                                </p>
                            </div>
                            {/* actions  */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    isLoading={isPending}
                                >
                                    {isPending ? 'Submitting...' : 'Submit application'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}