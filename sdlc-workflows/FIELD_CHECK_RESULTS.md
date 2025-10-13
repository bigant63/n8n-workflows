# ✅ Airtable Field Check Results

## Current Status

**Table Name**: ❌ Still "Table 1" - needs to be renamed to **"Conversations"**

## Fields Analysis

| # | Field Name | Current Type | Should Be | Status |
|---|------------|--------------|-----------|--------|
| 1 | chat_id | ✅ Single line text | Single line text | ✅ CORRECT |
| 2 | type | ❌ Long text | Single select | ⚠️ NEEDS FIX |
| 3 | role | ❌ Long text | Single line text | ⚠️ NEEDS FIX |
| 4 | content | ✅ Long text | Long text | ✅ CORRECT |
| 5 | requirements | ✅ Long text | Long text | ✅ CORRECT |
| 6 | html_output | ❌ AI Text | Long text | ⚠️ NEEDS FIX |
| 7 | design_version | ❌ Single line text | Number | ⚠️ NEEDS FIX |
| 8 | approval_status | ❌ Long text | Single select | ⚠️ NEEDS FIX |
| 9 | tokens_used | ❌ Long text | Number | ⚠️ NEEDS FIX |
| 10 | metadata | ✅ Long text | Long text | ✅ CORRECT |
| 11 | monday_item_id | ✅ Single line text | Single line text | ✅ CORRECT |
| 12 | is_iteration | ❌ Single line text | Checkbox | ⚠️ NEEDS FIX |

## Missing Fields

❌ **story_id** - needs to be added (Single line text)
❌ **created_at** - needs to be added (Created time)
❌ **id** - needs to be added (Auto number) OR rename chat_id

---

## 🔧 Fixes Needed

### Critical Fixes:

1. **Rename Table**: "Table 1" → "Conversations"

2. **Add Missing Fields**:
   - `story_id` (Single line text)
   - `created_at` (Created time)
   - `id` (Auto number) - or make chat_id the ID field

3. **Fix Field Types**:
   - `type`: Change from "Long text" to **Single select** with options: user, ai, pm, system
   - `role`: Change from "Long text" to "Single line text"
   - `html_output`: Change from "AI Text" to "Long text" 
   - `design_version`: Change from "Single line text" to **Number** (integer)
   - `approval_status`: Change from "Long text" to **Single select** with options: draft, pending, approved, rejected
   - `tokens_used`: Change from "Long text" to **Number** (integer)
   - `is_iteration`: Change from "Single line text" to **Checkbox**

---

## 📋 Quick Fix Instructions

### Step 1: Rename Table
- Click "Table 1" at top → Type "Conversations" → Enter

### Step 2: Add Missing Fields
Click "+ Add field" button:

**Field: story_id**
- Type: Single line text
- Create

**Field: created_at**
- Type: Created time
- Format: Local (friendly)
- Include time: Yes
- Create

**Field: id**
- Type: Auto number
- Create
(Or rename your existing chat_id to "id" if you want it as primary)

### Step 3: Fix Existing Fields
Click each field header → "Customize field type":

**type** → Change to:
- Single select
- Add options: user, ai, pm, system
- Save

**role** → Change to:
- Single line text
- Save

**html_output** → Change to:
- Long text
- Delete the AI Text field first, then create new "html_output" as Long text
- Save

**design_version** → Change to:
- Number
- Format: Integer
- Default: 1
- Save

**approval_status** → Change to:
- Single select
- Add options: draft, pending, approved, rejected
- Save

**tokens_used** → Change to:
- Number
- Format: Integer
- Default: 0
- Save

**is_iteration** → Change to:
- Checkbox
- Save

---

## ✅ Final Checklist

After fixes, you should have:
- [ ] Table renamed to "Conversations"
- [ ] 14 fields total
- [ ] All field types match above
- [ ] Single selects have proper options
- [ ] Numbers are integers with defaults

---

**Once done, test with a record to ensure no errors!**
