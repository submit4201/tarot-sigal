# Appwrite Manual Setup Checklist

Since you created the database manually, you need to ensure the **Indexes** and **Attributes** match exactly what the code expects. If these are missing, you will see "Invalid query" or "Missing attribute" errors.

## 1. Collection: `profiles`
**Attributes:**
- `userId` (String, 36 chars, Required)
- `givenName` (String, 100 chars)
- `currentName` (String, 100 chars)
- `birthDate` (String, 20 chars)
- `level` (Integer)
- `xp` (Integer)
- `stardust` (Integer)
- `isPremium` (Boolean)  <-- *Check this*
- `subscriptionTier` (String, 20 chars, default: 'free')
- `subscriptionExpiry` (String, 50 chars, optional) <-- *Rename 'subExpiry' to this*
- `ownedDeckIds` (String, 255 chars, Array)
- `unlockedAchievements` (String, 255 chars, Array)

**Indexes (Required for Queries):**
- **Key:** `idx_profiles_user`
- **Type:** `Key`
- **Attribute:** `userId` (ASC)

---

## 2. Collection: `readings`
**Attributes:**
- `userId` (String, 36 chars, Required)
- `profileId` (String, 36 chars)
- `spreadType` (String, 50 chars)
- `question` (String, 500 chars)
- `cards` (String, 5000 chars)
- `aiSummary` (String, 10000 chars)
- `notes` (String, 5000 chars)
- `createdAt` (String, 50 chars, Required)

**Indexes:**
- **Key:** `idx_readings_user` | **Type:** `Key` | **Attribute:** `userId` (ASC)
- **Key:** `idx_readings_created` | **Type:** `Key` | **Attribute:** `createdAt` (DESC)

---

## 3. Collection: `journal_entries`
**Attributes:**
- `userId` (String, 36 chars, Required)
- `profileId` (String, 36 chars)
- `text` (String, 5000 chars)
- `linkedCard` (String, 50 chars)
- `createdAt` (String, 50 chars, Required)

**Indexes:**
- **Key:** `idx_journal_user` | **Type:** `Key` | **Attribute:** `userId` (ASC)
- **Key:** `idx_journal_created` | **Type:** `Key` | **Attribute:** `createdAt` (DESC)

---

## 4. Collection: `daily_draws`
**Attributes:**
- `userId` (String, 36 chars, Required)
- `cardName` (String, 50 chars)
- `isReversed` (Boolean)
- `date` (String, 20 chars)
- `insights` (String, 1000 chars)

**Indexes:**
- **Key:** `idx_daily_user` | **Type:** `Key` | **Attribute:** `userId` (ASC)
- **Key:** `idx_daily_date` | **Type:** `Key` | **Attribute:** `date` (DESC)

---

## 5. Collection: `purchases`
**Attributes:**
- `userId` (String, 36 chars, Required)
- `type` (String, 50 chars)
- `amount` (Integer)
- `stripeSessionId` (String, 100 chars)
- `status` (String, 20 chars)
- `createdAt` (String, 50 chars, Required)

**Indexes:**
- **Key:** `idx_purchases_user` | **Type:** `Key` | **Attribute:** `userId` (ASC)
