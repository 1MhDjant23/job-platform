import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    error?: string
}

export  const Input = forwardRef<HTMLInputElement, Props>(
    ({ label,  error, className='', ...rest}, ref) => {
        return (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>

                <input
                    ref={ref} // pass RHF to the real DOM inpout
                    {...rest} // other props of input
                    className={`
                    w-full px-3 py-2.5 text-sm rounded-lg border
                    outline-none transition-colors duration-150
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${error
                    ? 'border-red-400 bg-red-50'    
                    : 'border-gray-300 bg-white'  
                    }
                    ${className}
                    `}
                />
                {
                    error && (
                        <p className="text-xs text-red-500 mt-0.5">
                            {error}
                        </p>
                    )
                }
            </div>
        );
    }
)

// displayName , shows "Input" in React DevTools
// instead of "ForwardRef" which is unreadable
Input.displayName = 'Input';