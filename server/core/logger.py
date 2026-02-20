import logging
import os
import zipfile
import glob
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
from pathlib import Path

# Base directory for logs: root of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_BASE_DIR = BASE_DIR / ".log"

def setup_logger(name: str) -> logging.Logger:
    """
    Sets up a logger according to the project rules:
    - Log to console and file
    - File in .log directory at project root
    - Subfolder for the specific log type (name)
    - Name format: {name}-MM-DD-YYYY--HH.log
    - Rotate every couple of hours (2 hours)
    - Compress into .zip
    """
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if setup_logger is called multiple times
    if logger.hasHandlers():
        return logger

    logger.setLevel(logging.INFO)

    log_dir = LOG_BASE_DIR / name
    log_dir.mkdir(parents=True, exist_ok=True)

    # We format the log filename suffix according to the requirement, 
    # but TimedRotatingFileHandler adds its own suffix by default. 
    # We will override the filename dynamically or just let TimedRotatingFileHandler 
    # use the base name and append the time.
    base_log_filename = log_dir / f"{name}.log"

    # Rotating every 2 hours
    file_handler = TimedRotatingFileHandler(
        filename=base_log_filename,
        when="H",
        interval=2,
        backupCount=30, # Keep around 30 backups
        encoding="utf-8"
    )

    # Customize the suffix for the rotated files to match MM-DD-YYYY--HH
    file_handler.suffix = "%m-%d-%Y--%H"
    
    # Custom namer and rotator to zip ancient files
    def namer(default_name):
        return default_name

    def rotator(source, dest):
        # source is the old file, dest is what it's being renamed to
        os.rename(source, dest)
        
        # After renaming, we immediately zip it to satisfy the compression rule.
        zip_filename = dest + ".zip"
        try:
            with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zf:
                # Add the file to the zip
                zf.write(dest, os.path.basename(dest))
            # Remove the original uncompressed log file
            os.remove(dest)
        except Exception as e:
            print(f"Failed to compress log {dest}: {e}")

    file_handler.namer = namer
    file_handler.rotator = rotator

    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%m-%d-%Y %H:%M:%S'
    )
    file_handler.setFormatter(formatter)

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

# Create the main application logger
app_logger = setup_logger("GameMaster")
