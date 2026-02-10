import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * ErrorBoundary — Catches uncaught errors in child component trees
 * and renders a cyberpunk-themed fallback UI instead of white-screening.
 *
 * ! This is a class component because React error boundaries require
 *   getDerivedStateFromError and componentDidCatch lifecycle methods,
 *   which are not available in function components.
 */
interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional label for which section this boundary wraps (for debugging) */
    fallbackLabel?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // * Log error details for debugging
        console.error(
            `[ErrorBoundary${this.props.fallbackLabel ? ` :: ${this.props.fallbackLabel}` : ''}] Caught error:`,
            error,
            errorInfo.componentStack
        );
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-[#0a0b12]/80 rounded-2xl border border-red-500/30 p-8 text-center space-y-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        {/* Glitch-style error indicator */}
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                                <span className="text-3xl">⚠</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold font-dm-sans text-red-400 mb-2">
                                Signal_Disrupted
                            </h2>
                            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-4">
                                {this.props.fallbackLabel
                                    ? `Module: ${this.props.fallbackLabel}`
                                    : 'Unknown_Module'}
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                A dimensional rift caused this module to malfunction.
                                The rest of the app remains operational.
                            </p>
                        </div>

                        {/* Error details (collapsed by default for non-dev users) */}
                        {this.state.error && (
                            <details className="text-left">
                                <summary className="text-[10px] font-mono text-white/20 uppercase tracking-widest cursor-pointer hover:text-white/40 transition-colors">
                                    Diagnostic_Data
                                </summary>
                                <pre className="mt-2 p-3 bg-black/60 rounded-lg text-[10px] font-mono text-red-300/60 overflow-auto max-h-32 border border-white/5">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                            Attempt_Reconnect
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
