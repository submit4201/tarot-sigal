/**
 * astroService.ts — Shared astrological utility functions.
 *
 * ! Extracted from OnboardingPage.tsx and ProfilePage.tsx where it was
 *   duplicated 3 times. This is now the single source of truth.
 */

import { AstrologicalSign } from '../types';

/**
 * getSignFromDate — Determines the Western astrological sun sign
 * from a date string (YYYY-MM-DD format).
 *
 * @param dateString - ISO-style date string (e.g. "1990-03-25")
 * @returns The AstrologicalSign or 'None' if the date is invalid/empty
 */
export const getSignFromDate = (dateString: string): AstrologicalSign => {
    if (!dateString) return 'None';

    // * Add time to avoid timezone interpretation issues
    const date = new Date(`${dateString}T00:00:00`);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // * Standard Western zodiac date ranges
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';

    return 'None';
};
