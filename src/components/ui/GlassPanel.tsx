import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'dark' | 'interactive';
    hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className = '',
    variant = 'default',
    hoverEffect = false,
    ...props
}) => {
    const baseStyles = "backdrop-blur-xl border rounded-[2rem] transition-all duration-300";

    const variants = {
        default: "bg-void-light/70 border-white/5 shadow-2xl",
        dark: "bg-void/80 border-white/5 shadow-xl", // Darker for modals/overlays
        interactive: "bg-void-light/40 border-white/10 hover:border-cosmic/30 hover:bg-void-light/60 cursor-pointer"
    };

    const hoverStyles = hoverEffect && variant !== 'interactive'
        ? "hover:border-cosmic/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:-translate-y-1"
        : "";

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
            {/* Optional Scanline or Noise overlay could go here if we wanted it built-in */}
        </div>
    );
};
