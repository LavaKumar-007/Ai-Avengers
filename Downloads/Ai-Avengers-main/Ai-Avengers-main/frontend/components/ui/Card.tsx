import { HTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(
                'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all dark:border-gray-800 dark:bg-dark-card',
                hoverEffect && 'hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';
export { Card };
