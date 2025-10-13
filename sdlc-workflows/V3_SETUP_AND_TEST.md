# 🚀 V3 Workflow - Setup & Testing Guide

## ✅ What's New in V3

**File**: `03_ux_engineer_v3_enhanced_notes.json`

### Enhanced Documentation:
✅ **Clean, readable notes** on every node (13 total)  
✅ **Simple ASCII format** (no unicode display issues)  
✅ **Emoji prefixes** for visual organization  
✅ **Clear explanations** of purpose, inputs, outputs

### Example Node Note:
```
USER ITERATION INPUT
====================

Receives design feedback from users.

POST /webhook/ux-chat
Body: {"message": "Make button blue", "chat_id": "STORY-001"}

Use for: Iterative design changes
Next: Merge Inputs
```

---

## 📥 Step 1: Import to n8n

### In n8n Cloud (https://nifty-chipmunk-54.webhook.n8n.cloud):

1. Click **"+" button** (top-right) → **"Import from File"**
2. Select: `03_ux_engineer_v3_enhanced_notes.json`
3. Click **"Import"**

---

## 🔐 Step 2: Configure Credentials

### Airtable Credentials (3 nodes need this):

**Nodes requiring Airtable credential:**
1. 💾 Save User/PM Message
2. 📜 Retrieve Conversation History  
3. 💾 Save AI Response

**Setup:**
1. Click each Airtable node
2. Under "Credential to connect with"
3. Select existing OR create new:
   - **Name**: Airtable UX Conversations
   - **Access Token**: `YOUR_AIRTABLE_TOKEN`
4. Click "Save"

### OpenAI Credentials (1 node):

**Node:** 🧠 OpenAI GPT-4

**Setup:**
1. Click the OpenAI node
2. Under "Credential to connect with"
3. Add your OpenAI API key
4. Click "Save"

---

## ⚡ Step 3: Activate Workflow

1. **Toggle "Active" switch** (top-right) to ON
2. Workflow turns from gray to green
3. Webhooks are now live!

---

## 🔗 Step 4: Get Your Webhook URLs

### PM Input Webhook:
1. Click **"🔶 PM Requirements Input"** node
2. Look for **"Webhook URLs"** section
3. Copy the **Production URL**
4. Should look like: `https://nifty-chipmunk-54.webhook.n8n.cloud/webhook/pm-to-ux`

### Chat Input Webhook:
1. Click **"🔷 UX Chat Input"** node  
2. Copy the **Production URL**
3. Should look like: `https://nifty-chipmunk-54.webhook.n8n.cloud/webhook/ux-chat`

---

## 🧪 Step 5: Test the Workflow

### Test 1: Create New Design (PM Mode)

```bash
curl -X POST "YOUR_PM_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "TEST-001",
    "requirements": "Create a modern login page with email and password fields. Include a remember me checkbox and forgot password link. Use blue as primary color.",
    "acceptance_criteria": [
      "Email validation",
      "Password show/hide toggle",
      "Responsive design"
    ],
    "monday_item_id": "12345"
  }'
```

**Expected:**
- ✅ HTML page displays in terminal (or save to file)
- ✅ **Check Airtable**: 2 new records
  - Record 1: type="pm", your requirements
  - Record 2: type="ai", generated HTML

**To view HTML:**
```bash
# Save response to file:
curl -X POST "YOUR_PM_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '...' \
  > test_design.html

# Open in browser:
open test_design.html  # Mac
# or
xdg-open test_design.html  # Linux
# or paste in browser
```

### Test 2: Iterate on Design (Chat Mode)

**IMPORTANT**: Use same `chat_id` from Test 1!

```bash
curl -X POST "YOUR_CHAT_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "TEST-001",
    "message": "Make the login button bigger and add a subtle shadow to make it stand out more"
  }' \
  > test_design_v2.html
```

**Expected:**
- ✅ Updated HTML displays
- ✅ **Check Airtable**: 4 total records (2 new)
  - Record 3: type="user", your feedback
  - Record 4: type="ai", updated HTML
- ✅ AI mentions "updated the button" (not "created")

### Test 3: Another Iteration

```bash
curl -X POST "YOUR_CHAT_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "TEST-001",
    "message": "Add a company logo placeholder at the top of the form"
  }' \
  > test_design_v3.html
```

**Expected:**
- ✅ HTML with logo added
- ✅ **Check Airtable**: 6 total records
- ✅ All 6 have same `chat_id`: "TEST-001"
- ✅ `design_version` increments: 1,1,2,2,3,3

---

## ✅ Verification Checklist

After all 3 tests:

### In Airtable:
- [ ] 6 records total with chat_id="TEST-001"
- [ ] type alternates: pm→ai→user→ai→user→ai
- [ ] design_version increments: 1,1,2,2,3,3
- [ ] html_output populated for AI records
- [ ] created_at timestamps in order

### In HTML Files:
- [ ] test_design.html (v1): Basic login page
- [ ] test_design_v2.html (v2): Bigger button with shadow
- [ ] test_design_v3.html (v3): With logo placeholder

### In n8n Executions:
- [ ] 3 successful executions (all green)
- [ ] No error nodes (no red X marks)
- [ ] "Retrieve History" shows increasing records

---

## 📖 View Node Documentation

### In n8n Workflow Editor:

1. Click any node to select it
2. Look at **left panel**
3. Scroll down to **"Notes"** section
4. Read the documentation!

**Every node has:**
- Purpose explanation
- Input/output format
- What it does
- Next node in flow

---

## 🐛 Troubleshooting

### Workflow not activated:
- Toggle "Active" switch to ON
- Check for red error indicators

### Webhook not responding (404):
- Ensure workflow is ACTIVE
- Copy webhook URL from node (don't type it)
- Check URL has no typos

### Airtable errors:
- Verify all 3 Airtable nodes have credentials
- Check Base ID: appWdPrlZVItMIbs7
- Check Table name: "Conversations"

### OpenAI errors:
- Verify API key is set in OpenAI node
- Check you have credits in OpenAI account
- Check API key has correct permissions

### No records in Airtable:
- Check workflow execution history (click "Executions")
- Look for failed nodes (red X)
- Click failed node to see error message

---

## 💡 Success Indicators

**You'll know it's working when:**

1. ✅ curl returns HTML (not error)
2. ✅ Airtable fills with conversation records
3. ✅ AI says "I've **updated** the button" (not "created")
4. ✅ Each version builds on previous
5. ✅ Version watermark shows in bottom-right
6. ✅ n8n executions all green

---

## 📊 What Each Test Does

### Test 1 Flow:
```
PM webhook → Build Context → Save PM msg → Retrieve (empty) 
→ Format → AI generates fresh → Save AI → Return HTML
```

### Test 2 & 3 Flow:
```
Chat webhook → Build Context → Save user msg → Retrieve (2,4 records)
→ Format with history → AI updates intelligently → Save AI → Return HTML
```

**The Magic**: AI sees full history and context!

---

## 🎯 Quick Reference

**Your Setup:**
- Base: `appWdPrlZVItMIbs7`
- Table: `Conversations`
- n8n: `https://nifty-chipmunk-54.webhook.n8n.cloud`
- Workflow: `03_ux_engineer_v3_enhanced_notes.json`

**Webhook Paths:**
- PM: `/webhook/pm-to-ux`
- Chat: `/webhook/ux-chat`

---

## 🚀 Next Steps After Testing

1. **View node notes** - Click each node, read documentation
2. **Check execution history** - See what data flows through
3. **Experiment** - Try different design requests
4. **Iterate multiple times** - Test 5, 10, 20 iterations!
5. **Integrate** - Connect to Monday.com workflow

---

**Import v3 now and start testing!** 🎨✨

The notes will display perfectly in n8n - simple, clean, readable ASCII format.
