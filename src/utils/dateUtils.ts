/**
 * @module dateUtils
 * @description Utility functions for local-timezone date handling.
 * All daily reset logic should use these helpers to ensure consistency
 * across the app — resets happen at local midnight, not UTC midnight.
 */

/**
 * Returns today's date as a YYYY-MM-DD string in the user's local timezone.
 * This ensures daily card draws reset at local midnight instead of UTC midnight.
 *
 * @note Uses 'en-CA' locale which natively formats as YYYY-MM-DD (ISO-like).
 * @returns {string} Date string in YYYY-MM-DD format (local timezone)
 */
export const getLocalDateString = (date: Date = new Date()): string => {
    return date.toLocaleDateString('en-CA'); // 'en-CA' outputs YYYY-MM-DD
};

/**
 * Returns a Date object representing the next local midnight.
 *
 * @returns {Date} The next midnight in the user's local timezone
 */
export const getNextLocalMidnight = (): Date => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return tomorrow;
};

/**
 * Calculates the time remaining until local midnight.
 *
 * @returns {{ hours: number; minutes: number; seconds: number; totalMs: number }}
 */
export const getTimeUntilMidnight = (): { hours: number; minutes: number; seconds: number; totalMs: number } => {
    const now = new Date();
    const midnight = getNextLocalMidnight();
    const totalMs = midnight.getTime() - now.getTime();

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, totalMs };
};
