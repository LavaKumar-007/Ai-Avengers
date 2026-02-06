import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className, variant = 'primary', size = 'md', isLoading, children, ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

    const variants = {
        primary: 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:brightness-110',
        secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
        outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
    };

    return (
        <button
            ref={ref}
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 animate-spin">⏳</span>
            ) : null}
            {children}
        </button>
    );
});

Button.displayName = 'Button';
export { Button };
