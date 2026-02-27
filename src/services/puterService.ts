
export async function generateWithPuter(messages: any[], streamCallback?: (chunk: string) => void): Promise<string> {
    if (!(window as any).puter) {
        console.warn("Puter.js not loaded. Make sure the script is included in index.html.");
        throw new Error("Puter.js library missing.");
    }

    try {
        const response = await (window as any).puter.ai.chat(messages, { stream: true });
        
        let fullText = "";
        
        for await (const part of response) {
            const textChunk = part?.text || "";
            fullText += textChunk;
            if (streamCallback) {
                streamCallback(textChunk);
            }
        }
        
        return fullText;
    } catch (e) {
        console.error("Puter AI generation failed:", e);
        throw e;
    }
}
