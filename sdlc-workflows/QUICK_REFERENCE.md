# 🚀 Quick Reference - UX Workflow v2

## Files You Need

**To Import**: `02_ux_engineer_v2_with_history.json`  
**Setup Guide**: `QUICKSTART_UX_V2.md`  
**Airtable Setup**: `AIRTABLE_SETUP.md`

## Setup Checklist

- [ ] 1. Create Airtable base with 15 fields
- [ ] 2. Get Base ID from Airtable
- [ ] 3. Edit JSON: Replace `YOUR_BASE_ID_HERE` with Base ID (3 places)
- [ ] 4. Import JSON to n8n
- [ ] 5. Add Airtable credentials (token provided)
- [ ] 6. Add OpenAI credentials
- [ ] 7. Activate workflow
- [ ] 8. Test with curl commands

## Your Credentials

**Airtable Token**: `YOUR_AIRTABLE_TOKEN`  
**Airtable Base ID**: `app____________` (get from Airtable after creating base)  
**Table Name**: `Conversations`

## Test Commands

```bash
# New Design
curl -X POST "YOUR_N8N_URL/webhook/pm-to-ux" \
  -H "Content-Type: application/json" \
  -d '{"story_id": "TEST-1", "requirements": "Create login page"}'

# Iterate
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "TEST-1", "message": "Make button blue"}'
```

## Verification

After each test, check:
- ✅ Airtable: New records created with same chat_id
- ✅ n8n: Execution successful, no errors
- ✅ Browser: HTML preview displays correctly
- ✅ AI: Shows understanding of previous context

## Key Concepts

**chat_id**: Groups all messages for same design  
**type**: Who sent it (user/ai/pm/system)  
**design_version**: Iteration number (1, 2, 3...)  
**html_output**: Generated design (AI messages only)

## Need Help?

**Issue**: Records not appearing in Airtable  
**Fix**: Check Base ID matches in JSON

**Issue**: AI doesn't remember context  
**Fix**: Check "Format History for AI" node output

**Issue**: Field not found error  
**Fix**: Verify all 15 fields created with exact names

## What's Next?

Once v2 works:
1. Use with Monday.com PM workflow
2. Add approval workflow
3. Build Phase 2 (Software Engineer)

---

**Quick Start**: Follow `QUICKSTART_UX_V2.md` step by step! 🎨
