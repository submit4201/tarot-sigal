/**
 * Google Text-to-Speech Service
 * Uses the Google Cloud TTS API (v1) to synthesize high-quality speech for Oracle-tier narration.
 *
 * @note Google Cloud TTS provides studio-quality voices far superior to native browser speechSynthesis.
 * @note The API key is read from VITE_GEMINI_API_KEY (same project, TTS is enabled on Gemini API keys).
 * @note Falls back to native speechSynthesis if the API key is absent or the request fails.
 * @note For live streaming (Google Live API), a WebSocket upgrade path is documented in
 *       the @todo below — the current implementation uses REST for simplicity and low latency.
 *
 * @todo Upgrade to Google Live API WebSocket streaming once the frontend WS infrastructure is in place.
 *       See: https://cloud.google.com/text-to-speech/docs/streaming-synthesis
 */

const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/** Preferred voice names for Oracle narration — Neural2 family for premium quality. */
const ORACLE_VOICE_NAMES = [
    'en-US-Neural2-J', // Deep, authoritative male voice
    'en-US-Neural2-D', // Smooth, resonant male alternative
    'en-US-Neural2-F', // Clear, warm female alternative
];

export interface TtsSpeakOptions {
    /** The text to synthesize. Should be plain text (no markdown). */
    text: string;
    /**
     * If true, use a premium Neural2 voice (Oracle tier).
     * If false, use a lighter Standard voice or fall back to native TTS.
     */
    premium?: boolean;
    /** Optional callback when audio playback completes. */
    onEnd?: () => void;
    /** Optional callback on error. */
    onError?: (err: Error) => void;
}

/**
 * Singleton AudioContext to avoid repeated context creation,
 * which is rate-limited by the browser.
 */
let _audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
    if (!_audioCtx || _audioCtx.state === 'closed') {
        _audioCtx = new AudioContext();
    }
    return _audioCtx;
}

/**
 * Cancels any pending native speech synthesis (cleanup).
 */
export function cancelSpeech(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Primary TTS function. Calls Google Cloud TTS API and plays the audio via WebAudio.
 * Falls back to native browser speechSynthesis if:
 *   - The API key is not configured.
 *   - The network request fails.
 *
 * @example
 * await googleTtsSpeak({ text: narrative, premium: true, onEnd: () => setIsPlaying(false) });
 */
export async function googleTtsSpeak(options: TtsSpeakOptions): Promise<void> {
    const { text, premium = false, onEnd, onError } = options;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // --- Fallback: native speechSynthesis ---
    if (!apiKey || !premium) {
        _nativeFallback(text, onEnd, onError);
        return;
    }

    try {
        const voiceName = ORACLE_VOICE_NAMES[0];

        const body = {
            input: { text },
            voice: {
                languageCode: 'en-US',
                name: voiceName,
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.92,      // Slightly slower for mystical feel
                pitch: -2.0,             // Slightly deeper
                effectsProfileId: ['headphone-class-device'],
            },
        };

        const response = await fetch(`${GOOGLE_TTS_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google TTS API error ${response.status}: ${errorText}`);
        }

        const data = await response.json() as { audioContent: string };

        // Decode the base64 MP3 and play via WebAudio API
        const binaryStr = atob(data.audioContent);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        const ctx = getAudioContext();
        const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => { onEnd?.(); };
        source.start(0);

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('[GoogleTTS] Failed, falling back to native TTS:', error.message);
        onError?.(error);
        _nativeFallback(text, onEnd, onError);
    }
}

/**
 * Native browser fallback TTS.
 * Uses the best available English voice with Oracle-appropriate rate/pitch.
 * @internal
 */
function _nativeFallback(text: string, onEnd?: () => void, onError?: (err: Error) => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        onError?.(new Error('speechSynthesis not available'));
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Select the best available English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
        voices.find(v => v.name.includes('Google UK English Male')) ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en-') && !v.localService) ||
        null;

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.rate = 0.88;
    utterance.pitch = 0.85;
    utterance.onend = () => { onEnd?.(); };
    utterance.onerror = (e) => { onError?.(new Error(`SpeechSynthesis error: ${e.error}`)); };

    window.speechSynthesis.speak(utterance);
}
