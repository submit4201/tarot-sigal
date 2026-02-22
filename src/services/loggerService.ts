import JSZip from 'jszip';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TODO';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: any;
}

class LoggerService {
    private logs: LogEntry[] = [];
    private readonly MAX_LOCAL_LOGS = 1000;
    private readonly FLUSH_INTERVAL = 30000; // 30 seconds
    private flushTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.startAutoFlush();
        // Persist critical logs immediately, batch others? 
        // For this implementation, we will log to console immediately and push to DB async.
    }

    private startAutoFlush() {
        if (this.flushTimer) clearInterval(this.flushTimer);
        this.flushTimer = setInterval(() => {
            this.flushToAppwrite(); // Optional: batch uploading if high volume
        }, this.FLUSH_INTERVAL);
    }

    private formatMessage(level: LogLevel, message: string, context?: any): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: context ? JSON.stringify(context) : undefined,
        };
    }

    public log(level: LogLevel, message: string, context?: any) {
        const entry = this.formatMessage(level, message, context);

        // 1. Console Output (Formatted)
        const style = this.getConsoleStyle(level);
        console.log(`%c[${entry.timestamp}] [${level}] ${message}`, style, context || '');

        // 2. Local Memory Buffer (for immediate export)
        this.logs.push(entry);
        if (this.logs.length > this.MAX_LOCAL_LOGS) {
            this.logs.shift(); // Rotate local buffer
        }

        // 3. Persist to Appwrite (Fire and Forget)
        // We don't await this to avoid blocking UI, unless it's critical
        this.persistLog(entry).catch(err => console.error('Failed to persist log:', err));
    }

    public info(message: string, context?: any) { this.log('INFO', message, context); }
    public warn(message: string, context?: any) { this.log('WARN', message, context); }
    public error(message: string, context?: any) { this.log('ERROR', message, context); }
    public debug(message: string, context?: any) { this.log('DEBUG', message, context); }
    public todo(message: string, context?: any) { this.log('TODO', message, context); }

    private getConsoleStyle(level: LogLevel): string {
        switch (level) {
            case 'INFO': return 'color: #21C7F2; font-weight: bold;'; // Neon Blue
            case 'WARN': return 'color: #F2C94C; font-weight: bold;'; // Amber
            case 'ERROR': return 'color: #EB5757; font-weight: bold; background: rgba(235, 87, 87, 0.1); padding: 2px;'; // Red
            case 'DEBUG': return 'color: #BBBBBB;'; // Grey
            case 'TODO': return 'color: #BB6BD9; font-weight: bold;'; // Purple
            default: return 'color: white;';
        }
    }

    private async persistLog(entry: LogEntry) {
        try {
            // Optional/TODO: Send logs to a FastAPI endpoint when implemented
            // e.g., await apiFetch('/logs', { method: 'POST', body: JSON.stringify(entry) });
        } catch (e) {
            // Fail silently to avoid infinite loops if logging errors
        }
    }

    // ! Rule 2-C/D Compliance: Export Logs to Zip
    public async exportLogs() {
        try {
            const zip = new JSZip();

            // Group logs by date for "folder structure" simulation inside zip
            const logsByHour: { [key: string]: LogEntry[] } = {};

            this.logs.forEach(log => {
                const date = new Date(log.timestamp);
                const folderName = `logs/${date.toISOString().split('T')[0]}`; // YYYY-MM-DD
                const fileName = `${folderName}/GameMaster-${date.getHours()}h.log`;

                if (!logsByHour[fileName]) logsByHour[fileName] = [];
                logsByHour[fileName].push(log);
            });

            // Add files to zip
            Object.entries(logsByHour).forEach(([path, entries]) => {
                const content = entries.map(e => `[${e.timestamp}] [${e.level}] ${e.message} ${e.context || ''}`).join('\n');
                zip.file(path, content);
            });

            // Generate Zip
            const blob = await zip.generateAsync({ type: 'blob' });

            // Trigger Download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gridpunk-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.info('Logs exported successfully.');
        } catch (error) {
            this.error('Failed to export logs', error);
        }
    }

    // Placeholder for flush logic if we were batching
    private async flushToAppwrite() {
        // Implementation for batched uploads if needed
    }
}

export const logger = new LoggerService();
export default logger;
