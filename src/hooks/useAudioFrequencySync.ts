import { useEffect, useState, useRef } from 'react';

// For this implementation, we simulate an audio frequency output since 
// actual WebRTC audio analysis requires a live audio stream/context.
// In a full WebRTC integration, we'd pipe the MediaStream to an AnalyserNode.

export function useAudioFrequencySync(isActive: boolean): number {
    const [intensity, setIntensity] = useState(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!isActive) {
            setIntensity(0);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            return;
        }

        const updateFrequency = () => {
            // Simulate a natural-feeling speech frequency (pulsing between 0.3 and 1.2)
            const time = Date.now() / 1000;
            const baseFrequency = Math.sin(time * 3) * 0.5 + 0.5; // slow wave
            const modulation = Math.sin(time * 15) * 0.3 * Math.random(); // fast jitter mimicking speech syllables

            const rawIntensity = Math.max(0, Math.min(1, baseFrequency + modulation));

            // Smoothed lerp
            setIntensity(prev => prev + (rawIntensity - prev) * 0.15);

            frameRef.current = requestAnimationFrame(updateFrequency);
        };

        frameRef.current = requestAnimationFrame(updateFrequency);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isActive]);

    return intensity;
}
