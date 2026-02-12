
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../src');
const TODO_DIR = path.resolve(__dirname, '../.todo');

// Rule 4 markers
const MARKERS = {
    'TODO': 'TODO',
    'FIXME': 'FIXME',
    'HACK': 'HACK',
    'NOTE': 'NOTE',
    'QUESTION': 'QUESTION',
    '!': 'IMPORTANT',
    '?': 'QUESTION',
    '*': 'NOTE',
    '[': 'TASK' // Handles [ ]
};

if (!fs.existsSync(TODO_DIR)) {
    fs.mkdirSync(TODO_DIR);
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const todos = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Check for single line comments
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) {
            const commentContent = trimmed.replace(/^(\/\/|\*)\s*/, '');

            // Check for markers
            for (const [marker, type] of Object.entries(MARKERS)) {
                if (commentContent.startsWith(marker) || commentContent.startsWith(`[${marker}]`)) {
                    todos.push({
                        file: path.relative(ROOT_DIR, filePath),
                        line: index + 1,
                        type: type,
                        content: commentContent
                    });
                    break;
                }
                // Special case for [ ] tasks
                if (marker === '[' && commentContent.startsWith('[ ]')) {
                    todos.push({
                        file: path.relative(ROOT_DIR, filePath),
                        line: index + 1,
                        type: 'TASK',
                        content: commentContent
                    });
                    break;
                }
            }
        }
    });
    return todos;
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')) {
                callback(dirPath);
            }
        }
    });
}

const allTodos = [];
walkDir(ROOT_DIR, (filePath) => {
    const fileTodos = scanFile(filePath);
    allTodos.push(...fileTodos);
});

// Generate Report
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = path.join(TODO_DIR, `audit-${timestamp}.md`);

let reportContent = `# Code Audit Report - ${new Date().toLocaleString()}\n\n`;
const grouped = allTodos.reduce((acc, todo) => {
    if (!acc[todo.type]) acc[todo.type] = [];
    acc[todo.type].push(todo);
    return acc;
}, {});

Object.entries(grouped).forEach(([type, items]) => {
    reportContent += `## ${type}\n`;
    items.forEach(item => {
        reportContent += `- **${item.file}:${item.line}**: ${item.content}\n`;
    });
    reportContent += '\n';
});

fs.writeFileSync(reportPath, reportContent);
console.log(`Audit complete. Report generated at ${reportPath}`);
