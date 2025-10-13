 requirements
- Record 2: type="ai", generated HTML

### Test 2: Iterate on Design (Chat Mode)

```bash
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Make the login button blue and bigger",
    "chat_id": "STORY-001"
  }'
```

**Check Airtable**: You should see 2 MORE new records
- Record 3: type="user", your feedback (version 2)
- Record 4: type="ai", updated HTML (version 2)

**All 4 records have same chat_id!** This is the conversation.

### Test 3: Another Iteration

```bash
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a forgot password link under the button",
    "chat_id": "STORY-001"
  }'
```

**Check Airtable**: 2 more records (total 6 now)
- All with same chat_id
- Versions incrementing: 1, 2, 3
- AI has context of ALL previous messages!

---

## 🎯 How Context Works

### Example Conversation Flow

**Message 1 (PM):**
```
type: "pm"
content: "Create login page with email and password"
version: 1
```

**Message 2 (AI):**
```
type: "ai"
html_output: "<form>...</form>" (with green button)
version: 1
```

**Message 3 (User):**
```
type: "user"
content: "Make the button blue"
version: 2
```

**Before generating Message 4, AI receives**:
```
=== CONVERSATION HISTORY ===
[1] PM (v1): Create login page with email and password
[2] AI (v1): [Generated HTML with green button]
[3] USER (v2): Make the button blue

=== NEW REQUEST ===
User: Make the button blue
```

**Message 4 (AI):**
```
type: "ai"
html_output: "<form>...</form>" (now with BLUE button!)
version: 2
```

**AI knows:**
- ✅ Original requirements (login page)
- ✅ What it built (form with green button)
- ✅ What to change (button color)
- ✅ What NOT to change (everything else)

---

## 📊 Viewing Conversation History

### In Airtable

**View 1: By Chat ID**
- Shows all messages grouped by conversation
- See the full iteration history

**View 2: Recent Activity**
- Shows newest messages first
- Monitor active conversations

**View 3: Pending Approval**
- Filter for designs waiting for approval
- (You'll add approval workflow later)

### Example View:

```
chat_id: STORY-001
├── [v1] PM: "Create login form"
├── [v1] AI: <HTML generated>
├── [v2] User: "Make button blue"
├── [v2] AI: <HTML updated>
├── [v3] User: "Add forgot password link"
└── [v3] AI: <HTML updated>
```

---

## 🔍 Debugging

### Check Airtable After Each Test

After every request, verify:
- [ ] New record(s) created
- [ ] chat_id matches
- [ ] type is correct (pm/user/ai)
- [ ] content saved
- [ ] html_output saved (for AI messages)
- [ ] version incremented

### Check n8n Execution

1. Go to **"Executions"** tab
2. Click latest execution
3. Check each node:
   - **Build Context**: chat_id generated?
   - **Save Message**: Record created in Airtable?
   - **Retrieve History**: Found previous messages?
   - **Format History**: Context summary looks good?
   - **AI Designer**: Got response with HTML?
   - **Save AI Response**: Saved to Airtable?

### Common Issues

**Issue**: "Table not found"  
**Fix**: Double-check Base ID in workflow JSON

**Issue**: "Field not found"  
**Fix**: Ensure all 15 fields created in Airtable (exact names matter!)

**Issue**: "No history retrieved"  
**Fix**: Ensure chat_id matches between requests

**Issue**: "AI doesn't remember previous design"  
**Fix**: Check "Format History for AI" node output - does it show previous messages?

---

## 💡 Usage Tips

### 1. Same chat_id = Same Conversation

Always use the same chat_id for iterations on the same screen:

```bash
# First request
curl ... -d '{"story_id": "STORY-001", ...}'

# Later iterations - use STORY-001 as chat_id
curl ... -d '{"chat_id": "STORY-001", "message": "..."}'
```

### 2. New Screen = New chat_id

For a different screen, use a different chat_id:

```bash
# Dashboard screen
curl ... -d '{"story_id": "STORY-002", ...}'

# Settings screen  
curl ... -d '{"story_id": "STORY-003", ...}'
```

### 3. Chat Interface Integration

When building a chat UI, generate chat_id on first message, then reuse:

```javascript
let chatId = null;

async function sendMessage(message) {
  if (!chatId) {
    chatId = 'chat_' + Date.now();
  }
  
  const response = await fetch('/webhook/ux-chat', {
    method: 'POST',
    body: JSON.stringify({
      message: message,
      chat_id: chatId
    })
  });
  
  return response.text(); // HTML preview
}
```

---

## 📈 What You Can Track

### In Airtable

**Per Conversation**:
- Total iterations
- Time between iterations
- Approval status
- Which requirements completed

**Per Design**:
- How many changes requested
- Most common feedback patterns
- Average iterations to approval

**Overall**:
- Total designs created
- Approval rate
- Average time to approval
- Most active stories

### Sample Airtable Formula (add as field)

**Iteration Count per Chat**:
```
{design_version}
```

**Time Since Last Update**:
```
DATETIME_DIFF(NOW(), {created_at}, 'hours')
```

---

## 🎨 Chat Interface Example (Enhanced)

Update the HTML chat interface to use chat_id:

```html
<script>
let chatId = null;
const WEBHOOK_URL = 'YOUR_N8N_URL/webhook/ux-chat';

async function generateDesign() {
    const request = document.getElementById('request').value;
    
    // Generate chat_id on first message
    if (!chatId) {
        chatId = 'chat_' + Date.now();
        document.getElementById('sessionId').value = chatId;
    }
    
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: request,
            chat_id: chatId
        })
    });
    
    const html = await response.text();
    document.getElementById('preview').srcdoc = html;
    
    // Show iteration count
    const version = response.headers.get('X-Design-Version');
    document.getElementById('status').textContent = 
        `✅ Design v${version} generated! (${getConversationLength()} messages)`;
}

// Track conversation length
let messageCount = 0;
function getConversationLength() {
    messageCount += 2; // User message + AI response
    return messageCount;
}
</script>
```

---

## 🚀 Next Steps

### Phase 1B: Add More Features

Once v2 works well, you can add:

1. **Approval Workflow**
   - Add approval button
   - Update approval_status in Airtable
   - Trigger SE workflow on approval

2. **Version Rollback**
   - Query Airtable for specific version
   - Load previous HTML
   - Let user go back to earlier iteration

3. **Monday.com Integration**
   - Update Monday item with preview link
   - Sync approval status
   - Add design version to item

4. **Analytics Dashboard**
   - Query Airtable for stats
   - Show iteration counts
   - Track approval rates

### Phase 2: Software Engineer Workflow

Once UX is complete with v2:
- Approved designs trigger SE workflow
- SE converts HTML to React components
- Full SDLC automation!

---

## ✅ Success Checklist

You'll know v2 is working when:

- [x] Airtable base created with all fields
- [x] Workflow imported with correct Base ID
- [x] Airtable credentials configured
- [x] OpenAI credentials configured
- [x] Workflow activated
- [x] Test 1: PM request creates 2 Airtable records
- [x] Test 2: Chat iteration creates 2 more records
- [x] Test 3: Another iteration creates 2 more records
- [x] All records have same chat_id
- [x] AI responses show understanding of context
- [x] HTML designs improve with each iteration

---

## 📞 Need Help?

### Before Asking:
1. Check Airtable - are records being created?
2. Check n8n Executions - which node failed?
3. Verify Base ID in JSON matches Airtable
4. Verify field names match exactly

### Files to Reference:
- `AIRTABLE_SETUP.md` - Base creation guide
- `docs/database_schema.md` - Schema details
- `TROUBLESHOOTING.md` - General debugging

---

**Ready to test? Follow the steps above and verify it works!**

Once working, you'll have a UX workflow with full conversation memory! 🎉
