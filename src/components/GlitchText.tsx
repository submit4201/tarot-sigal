import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const GlitchText: React.FC<{ text: string, delay?: number }> = ({ text, delay = 0 }) => {
    return (
        <span className="font-serif tracking-tighter neon-glow">
            <Typewriter
                words={[text]}
                loop={1}
                cursor
                cursorStyle='_'
                typeSpeed={50}
                deleteSpeed={50}
                delaySpeed={delay}
            />
        </span>
    );
};

export default GlitchText;
