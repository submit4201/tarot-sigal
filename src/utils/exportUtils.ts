
import { DrawnDivinationCard, SpreadType, DeckType } from '../types';
import { SPREAD_DETAILS, SHOP_DECKS } from '../constants';

export const formatReadingForExport = (
    reading: {
        spreadType: SpreadType;
        cards: (DrawnDivinationCard | null)[];
        deckId: string;
        date: string;
        intent?: string;
        summary?: string;
        practicalActions?: string[];
        shadowMessage?: string;
    }
): string => {
    const spreadName = SPREAD_DETAILS[reading.spreadType]?.name || reading.spreadType;
    const deckName = SHOP_DECKS.find(d => d.id === reading.deckId)?.name || "Unknown Deck";
    const dateStr = new Date(reading.date).toLocaleDateString() + " " + new Date(reading.date).toLocaleTimeString();

    let output = `--- GRIDPUNK ARCANA LOG ---\n`;
    output += `Timestamp: ${dateStr}\n`;
    output += `Protocol: ${spreadName}\n`;
    output += `Conduit: ${deckName}\n`;
    if (reading.intent) output += `Focus: ${reading.intent}\n`;
    output += `---------------------------\n\n`;

    reading.cards.forEach((card, index) => {
        if (!card) return;
        const positionName = SPREAD_DETAILS[reading.spreadType]?.positions[index] || `Node ${index + 1}`;
        output += `[${positionName}]\n`;
        output += `Signal: ${card.card.name} ${card.isReversed ? '(Reversed)' : ''}\n`;
        output += `Analysis: ${card.interpretation || card.card.meaning}\n`;
        output += `\n`;
    });

    if (reading.summary) {
        output += `--- MASTER SYNTHESIS ---\n${reading.summary}\n\n`;
    }

    if (reading.practicalActions && reading.practicalActions.length > 0) {
        output += `--- ACTION PROTOCOLS ---\n`;
        reading.practicalActions.forEach((action, i) => {
            output += `${i + 1}. ${action}\n`;
        });
        output += `\n`;
    }

    if (reading.shadowMessage) {
        output += `--- SHADOW SIGNAL ---\n${reading.shadowMessage}\n`;
    }

    output += `\n--- END TRANSMISSION ---`;

    return output;
};
