import React, { useState, useRef, useCallback } from 'react';
import { PlayIcon, PauseIcon } from './icons';

/**
 * AudioResonance
 * ==============
 * * NOTE: Generates real Solfeggio frequency tones using the Web Audio API.
 *   Maps Life Path numbers to specific frequencies and generates a pure sine
 *   wave with gentle binaural beat modulation (Shadow → Gift pitch shift).
 *
 * ! IMPORTANT: Uses AudioContext which requires user interaction to start
 *   (browser autoplay policy).
 */

interface AudioProps {
    lifePath: number;
}

// Solfeggio Frequency Map (Life Path → Hz)
const FREQ_MAP: Record<number, number> = {
    1: 174, 2: 285, 3: 396, 4: 417, 5: 528,
    6: 639, 7: 741, 8: 852, 9: 963,
    11: 528, 22: 432, 33: 963
};

// Shadow/Gift pitch offset (Hz) for binaural beat effect
const BINAURAL_OFFSET = 6; // 6Hz theta wave entrainment

const AudioResonance: React.FC<AudioProps> = ({ lifePath }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState<'shadow' | 'gift'>('gift');
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorLRef = useRef<OscillatorNode | null>(null);
    const oscillatorRRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    const baseFreq = FREQ_MAP[lifePath] || 432;
    // Shadow drops pitch by 20%, Gift is the base frequency
    const activeFreq = mode === 'shadow' ? baseFreq * 0.8 : baseFreq;

    const startAudio = useCallback(() => {
        // Create AudioContext on user gesture
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Master gain for fade-in/out
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5); // Gentle fade-in
        gain.connect(ctx.destination);
        gainRef.current = gain;

        // Left channel oscillator (base frequency)
        const oscL = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(activeFreq, ctx.currentTime);

        // Right channel oscillator (base + binaural offset)
        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(activeFreq + BINAURAL_OFFSET, ctx.currentTime);

        // Stereo panning for binaural effect
        const panL = ctx.createStereoPanner();
        panL.pan.setValueAtTime(-1, ctx.currentTime);
        const panR = ctx.createStereoPanner();
        panR.pan.setValueAtTime(1, ctx.currentTime);

        oscL.connect(panL).connect(gain);
        oscR.connect(panR).connect(gain);

        oscL.start();
        oscR.start();

        oscillatorLRef.current = oscL;
        oscillatorRRef.current = oscR;
    }, [activeFreq]);

    const stopAudio = useCallback(() => {
        const ctx = audioCtxRef.current;
        const gain = gainRef.current;

        if (gain && ctx) {
            // Gentle fade-out
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
            setTimeout(() => {
                oscillatorLRef.current?.stop();
                oscillatorRRef.current?.stop();
                ctx.close();
                audioCtxRef.current = null;
                oscillatorLRef.current = null;
                oscillatorRRef.current = null;
                gainRef.current = null;
            }, 350);
        }
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            stopAudio();
        } else {
            startAudio();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMode = () => {
        const newMode = mode === 'shadow' ? 'gift' : 'shadow';
        setMode(newMode);

        // If playing, update frequencies live
        if (isPlaying && oscillatorLRef.current && oscillatorRRef.current && audioCtxRef.current) {
            const newFreq = newMode === 'shadow' ? baseFreq * 0.8 : baseFreq;
            const ctx = audioCtxRef.current;
            oscillatorLRef.current.frequency.linearRampToValueAtTime(newFreq, ctx.currentTime + 1);
            oscillatorRRef.current.frequency.linearRampToValueAtTime(newFreq + BINAURAL_OFFSET, ctx.currentTime + 1);
        }
    };

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            {/* Frequency label */}
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                {Math.round(activeFreq)}Hz
            </span>

            {/* Mode toggle */}
            <button
                onClick={toggleMode}
                className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border transition-all ${mode === 'gift'
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                        : 'bg-red-500/20 border-red-500/30 text-red-300'
                    }`}
            >
                {mode}
            </button>

            {/* Play/Pause */}
            <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors shadow-glow"
            >
                {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>

            {/* Audio Visualizer */}
            <div className="flex gap-0.5 h-4 items-center">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div
                        key={i}
                        className={`w-0.5 bg-purple-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce' : ''
                            }`}
                        style={{
                            animationDelay: `${i * 0.08}s`,
                            height: isPlaying ? `${Math.random() * 60 + 40}%` : '20%',
                            opacity: isPlaying ? 0.8 : 0.3
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AudioResonance;
