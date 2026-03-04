import React, { useRef, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';

interface AutoTextAreaProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

const AutoTextarea: React.FC<AutoTextAreaProps> = ({ value, onChange, placeholder, className }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [localValue]);

    useEffect(() => {
        if (listening) {
            setLocalValue(value + (value ? ' ' : '') + transcript);
        }
    }, [transcript, listening]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalValue(e.target.value);
        onChange(e.target.value);
    };

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            onChange(localValue);
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full min-h-[120px] bg-white/5 border border-white/10 rounded-3xl p-6 pr-12 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none font-dm-sans overflow-hidden ${className || ''}`}
            />
            {browserSupportsSpeechRecognition && (
                <button
                    onClick={toggleListening}
                    className={`absolute right-4 bottom-4 p-2 rounded-full transition-all ${listening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-text-muted hover:text-purple-400'}`}
                >
                    {listening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
};

export default AutoTextarea;
