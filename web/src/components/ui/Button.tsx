import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean,
    variant?: 'primary' | 'secondary' | 'danger'
}

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
};


export  function Button(
    {children, isLoading=false, variant='primary', className='', disabled, ...rest} : Props
) {
    return (
        <button
            {...rest}
            disabled={disabled || isLoading}
            className={`
                w-full py-2.5 px-4 rounded-lg font-medium text-sm
                transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${variants[variant]}
                ${className}
            `}
        >
            { isLoading && <Spinner size="sm" /> }
            {children}
        </button>
    );
}