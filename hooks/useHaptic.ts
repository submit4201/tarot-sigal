
import { useCallback } from 'react';

export const useHaptic = () => {

    // Check if vibration is supported
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

    const trigger = useCallback((pattern: number | number[]) => {
        if (isSupported) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Silently fail if vibration is blocked or throws
                console.debug("Haptic feedback failed", e);
            }
        }
    }, [isSupported]);

    const triggerSelection = useCallback(() => {
        trigger(20); // Short, sharp tick
    }, [trigger]);

    const triggerHover = useCallback(() => {
        trigger(5); // Very subtle tick
    }, [trigger]);

    const triggerImpact = useCallback(() => {
        trigger([40, 50, 20]); // Heavy impact pattern
    }, [trigger]);

    const triggerRipple = useCallback(() => {
        trigger([10, 30, 10, 30, 10]); // Ripple effect
    }, [trigger]);

    return {
        triggerSelection,
        triggerHover,
        triggerImpact,
        triggerRipple,
        isSupported
    };
};
