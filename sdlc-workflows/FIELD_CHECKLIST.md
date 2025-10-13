# ✅ Airtable Setup Checklist - Copy/Paste Friendly

## 🎯 Your Info
- **Base URL**: https://airtable.com/appWdPrlZVItMIbs7
- **Table Name**: `Conversations`
- **Token**: Already in workflow ✅

---

## 📋 Field Setup (Copy field names exactly!)

### Step 1: Rename "Table 1" → "Conversations"

### Step 2: Rename first field → "id" (keep auto-number type)

### Step 3: Add these 13 fields:

```
✅ Field Names (copy these exactly):

1.  chat_id          → Single line text
2.  type             → Single select: user, ai, pm, system  
3.  role             → Single line text
4.  content          → Long text
5.  story_id         → Single line text
6.  requirements     → Long text
7.  html_output      → Long text
8.  design_version   → Number (integer, default: 1)
9.  approval_status  → Single select: draft, pending, approved, rejected
10. tokens_used      → Number (integer, default: 0)
11. metadata         → Long text
12. monday_item_id   → Single line text
13. is_iteration     → Checkbox
14. created_at       → Created time (with time, local format)
```

---

## 🧪 Test Record (Add this after creating fields):

```
chat_id: test_001
type: user
role: user
content: This is a test message
story_id: TEST-001
design_version: 1
approval_status: draft
is_iteration: (unchecked)
```

Leave other fields empty for now.

---

## ✅ Verification

Your table should look like:
```
| id | chat_id  | type | role | content       | ... | design_version | approval_status |
|----|----------|------|------|---------------|-----|----------------|-----------------|
| 1  | test_001 | user | user | This is a... |     | 1              | draft           |
```

---

## 🚀 After Setup

1. Import workflow: `02_ux_engineer_v2_with_history.json`
2. Add credentials (token already saved in guide)
3. Activate & test!

**Total time**: ~5 minutes 🎉
