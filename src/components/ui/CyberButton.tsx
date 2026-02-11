import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    disabled,
    ...props
}) => {
    const baseStyles = "relative font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";

    const variants = {
        primary: "bg-gradient-to-r from-cosmic-dark to-cosmic text-white rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] border border-white/10",
        secondary: "bg-void-lighter border border-cosmic/30 text-cosmic-light rounded-xl hover:border-cosmic hover:bg-cosmic/10 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.05)]",
        ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5 rounded-lg border border-transparent",
        danger: "bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500 hover:text-red-200"
    };

    const sizes = {
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-3 text-xs",
        lg: "px-10 py-5 text-sm"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Loading Spinner Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}

            <span className={isLoading ? "opacity-0" : "flex items-center gap-2 relative z-0"}>
                {icon && <span className="group-hover:animate-pulse">{icon}</span>}
                {children}
            </span>

            {/* Shine Effect for Primary */}
            {variant === 'primary' && !disabled && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none"></div>
            )}
        </button>
    );
};
