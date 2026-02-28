"""
TAROT DECK VALIDATION & CLEANUP TOOLKIT

This toolkit provides scripts to validate, clean, and track the status of your
tarot card CSV files across multiple decks.

================================================================================
SCRIPTS OVERVIEW
================================================================================

1. validate_csv_format.py
   - Scans all CSV files in tarot_gen/data/output/
   - Reports card counts, formatting issues, duplicates
   - Generates 2 report files:
     * DECK_STATUS_REPORT.txt - Complete/incomplete deck listing
     * INCOMPLETE_DECKS_REPORT.txt - Only shows decks needing cards

   Usage:
   $ python validate_csv_format.py              # Full validation + reports
   $ python validate_csv_format.py --check-mixed  # Show combined decks

2. deduplicate_csv.py
   - Removes duplicate card entries from CSV files
   - Adds proper CSV headers if missing
   - Saves cleaned version with "_deduped" suffix

   Usage:
   $ python deduplicate_csv.py                  # Auto-clean all problematic files
   $ python deduplicate_csv.py file.csv         # Clean specific file
   $ python deduplicate_csv.py file.csv out.csv  # Custom output file

================================================================================
WORKFLOW
================================================================================

1. VALIDATE YOUR DECKS
   $ python validate_csv_format.py

   This creates:
   - DECK_STATUS_REPORT.txt (complete overview)
   - INCOMPLETE_DECKS_REPORT.txt (action items)

2. REVIEW THE REPORTS
   - Check which decks are at 100% (78 cards)
   - Note which decks are incomplete and how many cards are missing
   - Identify any duplicates or formatting issues

3. CLEAN DUPLICATES
   $ python deduplicate_csv.py

   This removes any duplicate cards and ensures proper headers.
   Cleaned files are saved with "_deduped" suffix.

4. GENERATE MISSING CARDS
   Use the prompt_builder to generate prompts for missing cards:
   $ py -m tarot_gen.prompt_builder

   The system will:
   - Load existing CSV files
   - Use Puter (primary), OpenRouter, or DashScope as fallback
   - Append new prompts to existing CSVs

5. VALIDATE AGAIN
   $ python validate_csv_format.py

   Verify that missing cards have been generated and deck is complete.

================================================================================
STANDARD TAROT DECK STRUCTURE
================================================================================

A complete tarot deck = 78 cards total:

22 Major Arcana:
  - maj_00 to maj_21 (The Fool through The World)

56 Minor Arcana (4 suits × 14 cards each):
  - Wands: wan_01 to wan_14
  - Cups: cup_01 to cup_14
  - Swords: swo_01 to swo_14
  - Pentacles: pen_01 to pen_14

Card ID Format: prefix_number (e.g., maj_00, wan_01, cup_05, swo_14)

================================================================================
CSV FORMAT REQUIREMENTS
================================================================================

Proper CSV format with 3 columns:

Header row (required):
ID,Name,Final_Prompt

Data rows:
maj_00,The Fool,"Vivid description of The Fool card..."
maj_01,The Magician,"Vivid description of The Magician card..."
...

Notes:
- First column: Card ID (prefix_number)
- Second column: Card name (human-readable)
- Third column: Final_Prompt (image generation prompt)
- Prompts should be continuous single lines (no newlines within the prompt)

================================================================================
REPORT FILES
================================================================================

1. DECK_STATUS_REPORT.txt
   Shows all decks organized by completion status:
   - Lists COMPLETE decks (10 out of 12 = 83%)
   - Lists INCOMPLETE decks with missing card count
   - Total summary statistics

2. INCOMPLETE_DECKS_REPORT.txt
   Shows only decks needing work:
   - Completion percentage for each incomplete deck
   - Number of missing cards
   - Quick reference for action items

Generated fresh each time you run validate_csv_format.py

================================================================================
COMMAND QUICK REFERENCE
================================================================================

# Full workflow - do this regularly
python validate_csv_format.py          # Check status + generate reports
python deduplicate_csv.py              # Clean any duplicates
py -m tarot_gen.prompt_builder         # Generate missing cards
python validate_csv_format.py          # Verify completion

# Individual operations
python validate_csv_format.py --check-mixed    # Find mixed/combined decks
python deduplicate_csv.py specific_file.csv    # Clean one file
python validate_csv_format.py > output.log     # Save report to file

================================================================================
TROUBLESHOOTING
================================================================================

Issue: "Duplicates in quantum_entanglement_tarot_prompts.csv"
Solution: Run deduplicate_csv.py to remove duplicate card entries

Issue: "Missing header in [deck_name]"
Solution: deduplicate_csv.py automatically adds proper headers

Issue: "NO HEADER: This CSV might lack proper column headers"
Solution: The CSV exists but may have issues. Run deduplicate_csv.py

Issue: Deck shows 79 lines but 78 cards
Reason: First line is the header (ID,Name,Final_Prompt), so 79 total lines = 78 data rows

Issue: Deck has more than 78 cards
Reason: Likely combined cards from multiple decks. Run with --check-mixed flag

================================================================================
"""

if __name__ == "__main__":
    print(__doc__)
