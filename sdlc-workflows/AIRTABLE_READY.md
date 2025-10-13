# ✅ Your Airtable Base is Ready!

## 🎉 What I Did

✅ **Found your existing base**: `UX Design Conversations`  
✅ **Base ID**: `appWdPrlZVItMIbs7`  
✅ **Updated workflow JSON** with your Base ID (3 locations)  
✅ **Created CSV template** for easy table import

---

## 📋 Next Steps (Choose One)

### Option 1: Import CSV Template (FASTEST - 3 minutes)

1. **Go to your base**: https://airtable.com/appWdPrlZVItMIbs7

2. **Delete "Table 1"** (or rename it later)

3. **Import CSV**:
   - Click "+" button to add table
   - Choose "CSV file"
   - Upload: `/Users/anthonyhill/n8n/n8n-workflows/sdlc-workflows/airtable_template.csv`
   - Name it: `Conversations`

4. **Adjust field types** after import:
   - `created_at` → Change to "Created time" type
   - `type` → Change to "Single select" with options: user, ai, pm, system
   - `role` → Keep as "Single line text"
   - `design_version` → Change to "Number" type
   - `approval_status` → Change to "Single select" with options: draft, pending, approved, rejected
   - `tokens_used` → Change to "Number" type
   - `is_iteration` → Change to "Checkbox" type

5. **Done!** Your table structure is ready

---

### Option 2: Manual Setup (DETAILED - 10 minutes)

Follow the complete guide in `AIRTABLE_SETUP.md`

**15 Fields to create**:
1. id (Auto number) - rename existing "Name" field
2. chat_id (Single line text)
3. created_at (Created time)
4. type (Single select: user, ai, pm, system)
5. role (Single line text)
6. content (Long text)
7. story_id (Single line text)
8. requirements (Long text)
9. html_output (Long text)
10. design_version (Number, default: 1)
11. approval_status (Single select: draft, pending, approved, rejected)
12. tokens_used (Number, default: 0)
13. metadata (Long text)
14. monday_item_id (Single line text)
15. is_iteration (Checkbox)

---

## 🚀 Your Workflow is Ready!

### Files Updated:

✅ **`02_ux_engineer_v2_with_history.json`**
   - Base ID: `appWdPrlZVItMIbs7` (already configured!)
   - Ready to import to n8n

### Your Credentials:

**Airtable**:
- Token: `YOUR_AIRTABLE_TOKEN`
- Base ID: `appWdPrlZVItMIbs7`
- Table Name: `Conversations`

---

## 📝 Quick Import to n8n

1. **Import Workflow**:
   - Open n8n
   - Import: `02_ux_engineer_v2_with_history.json`

2. **Configure Airtable Credentials**:
   - Click any Airtable node
   - Create new credential
   - Name: "Airtable UX Conversations"
   - API Token: `YOUR_AIRTABLE_TOKEN`
   - Apply to all 3 Airtable nodes

3. **Configure OpenAI Credentials**:
   - Add your OpenAI API key

4. **Activate & Test**!

---

## 🧪 Test Commands

Once table is set up and workflow imported:

```bash
# Test 1: New Design
curl -X POST "YOUR_N8N_URL/webhook/pm-to-ux" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "STORY-001",
    "requirements": "Create a modern login page",
    "acceptance_criteria": ["Email validation"]
  }'
```

**Check Airtable**: You should see 2 new records!

```bash
# Test 2: Iterate
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "STORY-001",
    "message": "Make the button blue and bigger"
  }'
```

**Check Airtable**: 2 more records (4 total), all with same chat_id!

---

## ✅ Success Checklist

- [ ] Airtable table "Conversations" created
- [ ] All 15 fields added with correct types
- [ ] CSV template imported (or manual setup done)
- [ ] Test records visible in Airtable
- [ ] Workflow imported to n8n
- [ ] Airtable credentials configured
- [ ] OpenAI credentials configured
- [ ] Workflow activated
- [ ] Test 1 passed (2 records in Airtable)
- [ ] Test 2 passed (4 records total, same chat_id)

---

## 🎯 What You Have Now

**Your Base ID**: `appWdPrlZVItMIbs7` ✅  
**Workflow JSON**: Updated with Base ID ✅  
**CSV Template**: Ready to import ✅  
**Setup Guide**: `AIRTABLE_SETUP.md` ✅  
**Quick Reference**: `QUICK_REFERENCE.md` ✅

---

## 📞 Need Help?

**Airtable not working?**
- Verify Base ID: `appWdPrlZVItMIbs7`
- Check table name: `Conversations` (exact spelling)
- Verify all field names match (case-sensitive!)

**n8n errors?**
- Check Airtable credentials in all 3 nodes
- Verify Base ID in workflow JSON
- Check execution logs for specific errors

---

## 🎉 You're Almost There!

1. Import the CSV template to Airtable
2. Import the workflow to n8n  
3. Configure credentials
4. Test!

**Total time**: ~10 minutes until your first AI-generated design with full conversation memory! 🚀

---

**Next**: Follow `QUICKSTART_UX_V2.md` for complete testing guide!
