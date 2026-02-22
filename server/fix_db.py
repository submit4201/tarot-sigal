import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'gridpunk.db')
if not os.path.exists(db_path):
    print('DB not found')
    exit(0)

print('Connecting to DB...')
conn = sqlite3.connect(db_path)
c = conn.cursor()

columns = [
    ('is_premium', 'BOOLEAN DEFAULT 0'),
    ('subscription_tier', "VARCHAR(50) DEFAULT 'Seeker'"),
    ('subscription_expiry', 'DATETIME'),
    ('stripe_customer_id', 'VARCHAR(100)'),
    ('stardust', 'INTEGER DEFAULT 0'),
    ('level', 'INTEGER DEFAULT 1'),
    ('xp', 'INTEGER DEFAULT 0'),
    ('owned_deck_ids', 'TEXT DEFAULT \'["default_tarot", "ancient_runes"]\''),
    ('unlocked_achievements', 'TEXT DEFAULT \'[]\'')
]

for col, dtype in columns:
    try:
        c.execute(f'ALTER TABLE users ADD COLUMN {col} {dtype}')
        print(f'Added {col}')
    except sqlite3.OperationalError as e:
        print(f'Skipped {col}: {e}')

conn.commit()
conn.close()
print('Done!')
