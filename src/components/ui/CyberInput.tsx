import React from 'react';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    multiline?: boolean;
    rows?: number;
}

export const CyberInput: React.FC<CyberInputProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    multiline = false,
    rows = 3,
    ...props
}) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
    const baseClasses = `
        w-full bg-void-lighter border-white/10 rounded-xl 
        ${icon ? 'pl-12 pr-4' : 'px-6'} py-4
        text-white font-mono text-sm placeholder:text-white/20
        border transition-all duration-300
        focus:outline-none focus:border-cosmic-glow focus:ring-1 focus:ring-cosmic-glow/50 focus:bg-void-light
        hover:border-white/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? '!border-red-500/50 !focus:border-red-500' : ''}
    `;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-mono text-white/40 uppercase tracking-widest pl-1"
                >
                    {label}
                </label>
            )}

            <div className="relative group">
                {icon && (
                    <div className={`absolute left-4 ${multiline ? 'top-4' : 'top-1/2 -translate-y-1/2'} text-white/30 group-focus-within:text-cosmic transition-colors pointer-events-none`}>
                        {icon}
                    </div>
                )}

                {multiline ? (
                    <textarea
                        id={inputId}
                        className={`${baseClasses} resize-none`}
                        rows={rows}
                        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                ) : (
                    <input
                        id={inputId}
                        className={baseClasses}
                        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/0 group-focus-within:border-cosmic/50 transition-all duration-500 rounded-tl-lg pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/0 group-focus-within:border-cosmic/50 transition-all duration-500 rounded-br-lg pointer-events-none"></div>
            </div>

            {error && (
                <p className="text-[10px] text-red-400 font-mono tracking-wide pl-1 animate-fade-in">
                    //! ERROR: {error}
                </p>
            )}
        </div>
    );
};
