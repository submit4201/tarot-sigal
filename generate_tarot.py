"""
Tarot Card Generator - Quick Launch Script
Run: python generate_tarot.py --batch --sequential
"""
import sys
from pathlib import Path

# Add tarot_gen to path
sys.path.insert(0, str(Path(__file__).parent))

# Import and run CLI
from tarot_gen.cli import main
import asyncio

if __name__ == "__main__":
    asyncio.run(main())
