import os
import re
from datetime import datetime
import glob

def find_comments_in_file(filepath):
    comments = []
    # Simplified regexes for matching comments. 
    # Matches // or # comments, and lines that look like block comments
    # Also looks for specific keywords: TODO, FIXME, HACK, QUESTION, NOTE, [ ], !, ?, *
    
    # We will just look at each line for either '#' or '//' and then check keywords
    keywords = ['TODO', 'FIXME', 'HACK', 'QUESTION', 'NOTE', r'\[ \]', r'!', r'\?', r'\*']
    keyword_pattern = re.compile(f"({'|'.join(keywords)})", re.IGNORECASE)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for idx, line in enumerate(lines):
                # Search for single-line comments in python, TS, JS
                if '#' in line or '//' in line:
                    if keyword_pattern.search(line):
                        comments.append(f"Line {idx+1}: {line.strip()}")
    except Exception as e:
        pass
    
    return comments

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    dirs_to_ignore = ['.git', 'node_modules', '.log', '.test', '.todo', 'dist', '.vscode']
    extensions = ['.py', '.ts', '.tsx', '.js', '.jsx']
    
    all_comments = {}
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Prevent traversing ignored directories
        dirnames[:] = [d for d in dirnames if d not in dirs_to_ignore]
        
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(dirpath, filename)
                found = find_comments_in_file(filepath)
                if found:
                    all_comments[filepath.replace(root_dir, '')] = found

    todo_dir = os.path.join(root_dir, '.todo')
    os.makedirs(todo_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d--%H")
    log_file = os.path.join(todo_dir, f"todo-summary-{timestamp}.md")
    
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write("# Codebase TODO Audit\n\n")
        f.write(f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        for file, comments in all_comments.items():
            f.write(f"### {file}\n")
            for c in comments:
                f.write(f"- {c}\n")
            f.write("\n")
            
    print(f"Archived {sum(len(v) for v in all_comments.values())} comments to {log_file}")

if __name__ == '__main__':
    main()
