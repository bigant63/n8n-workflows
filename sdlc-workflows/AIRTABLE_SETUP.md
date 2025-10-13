# Airtable Setup Guide for UX Conversations

## Step 1: Create Airtable Base

1. **Go to Airtable**: https://airtable.com
2. **Create New Base**: Click "+" → "Start from scratch"
3. **Name it**: "UX Design Conversations"

## Step 2: Create Table Structure

### Table Name: `Conversations`

**Create these fields in order:**

1. **Name** (default field) - Rename to: `id`
   - Type: Auto number (already set)

2. **chat_id**
   - Type: Single line text
   - Description: Groups related messages for same design

3. **created_at**
   - Type: Created time
   - Include time: Yes
   - Time zone: Use GMT
   - Format: Local (friendly)

4. **type**
   - Type: Single select
   - Options:
     - user (blue)
     - ai (green)
     - pm (orange)
     - system (gray)

5. **role**
   - Type: Single line text
   - Description: For AI context (user, assistant, system)

6. **content**
   - Type: Long text
   - Enable rich text formatting: No

7. **story_id**
   - Type: Single line text
   - Description: Monday.com story reference

8. **requirements**
   - Type: Long text
   - Description: Original PM requirements

9. **html_output**
   - Type: Long text
   - Description: Generated HTML design

10. **design_version**
    - Type: Number
    - Format: Integer
    - Default: 1

11. **approval_status**
    - Type: Single select
    - Options:
      - draft (gray)
      - pending (yellow)
      - approved (green)
      - rejected (red)

12. **tokens_used**
    - Type: Number
    - Format: Integer
    - Default: 0

13. **metadata**
    - Type: Long text
    - Description: JSON for additional data

14. **monday_item_id**
    - Type: Single line text
    - Description: Monday.com item ID

15. **is_iteration**
    - Type: Checkbox
    - Description: True if updating existing design

## Step 3: Create Views

### View 1: All Conversations (default)
- Already exists

### View 2: By Chat ID
- Group by: `chat_id`
- Sort: `created_at` (oldest → newest)

### View 3: Pending Approval
- Filter: `approval_status` = "pending"
- Sort: `created_at` (newest first)

### View 4: Recent Activity
- Sort: `created_at` (newest first)
- Limit: 50 records

## Step 4: Get Base ID

1. Click **Help** (? icon) in top right
2. Click **API documentation**
3. Find your Base ID - it looks like: `appXXXXXXXXXXXXXX`
4. **Copy this ID** - you'll need it for n8n

Example: `app1234567890abcd`

## Step 5: Test Your Setup

Add a test record manually:
- chat_id: `test_001`
- type: `user`
- role: `user`
- content: `This is a test message`
- design_version: `1`

If you can see it in the table, you're ready!

---

## Your Credentials

**API Token**: `YOUR_AIRTABLE_TOKEN`

**Base ID**: `app_____________` ← You need to get this from Step 4

**Table Name**: `Conversations`

---

## Quick Visual Reference

Your Airtable should look like this:

```
┌─────┬──────────┬────────────────────┬──────┬──────┬─────────┬──────────┐
│ id  │ chat_id  │ created_at         │ type │ role │ content │ version  │
├─────┼──────────┼────────────────────┼──────┼──────┼─────────┼──────────┤
│ 1   │ abc123   │ 2025-01-07 10:00   │ pm   │ sys  │ Create..│ 1        │
│ 2   │ abc123   │ 2025-01-07 10:01   │ ai   │ asst │ I've... │ 1        │
│ 3   │ abc123   │ 2025-01-07 10:05   │ user │ user │ Make... │ 2        │
│ 4   │ abc123   │ 2025-01-07 10:06   │ ai   │ asst │ Updated │ 2        │
└─────┴──────────┴────────────────────┴──────┴──────┴─────────┴──────────┘
```

All rows with same `chat_id` = same design conversation!

---

## Ready for n8n?

Once you have:
- ✅ Base created with all fields
- ✅ Base ID copied
- ✅ Test record added

You're ready for the updated workflow!

**Next**: I'll create the workflow JSON with Airtable nodes configured.
