# UX Design Conversation Database Schema

## Overview
Stores conversation history and design iterations for UX Engineer workflow, enabling the AI to maintain context across multiple interactions.

## Database Options

### Option 1: PostgreSQL (Recommended for Production)
- Full relational database
- Better for complex queries
- Self-hosted or cloud (Supabase, Railway)
- Free tier available

### Option 2: Airtable (Easier Setup)
- No-code database with API
- Visual interface for debugging
- Easier to browse conversations
- Limited free tier (1,200 records/base)

**Recommendation: Start with Airtable for quick setup, migrate to Postgres later if needed**

---

## Schema: `ux_conversations` Table

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | Auto Number | Primary key | 1, 2, 3... |
| `chat_id` | Text (UUID) | Groups related messages | "chat_abc123" |
| `session_id` | Text (UUID) | Same as chat_id (for compatibility) | "chat_abc123" |
| `created_at` | DateTime | When message was created | 2025-01-07 10:30:00 |
| `type` | Single Select | Who sent the message | "user", "ai", "pm", "system" |
| `role` | Text | For AI context | "user", "assistant", "system" |
| `content` | Long Text | Message content | "Make the button blue" |
| `story_id` | Text | Related Monday.com story | "STORY-123" |
| `requirements` | Long Text | Original PM requirements | "Create login form..." |
| `html_output` | Long Text | Generated HTML (if AI response) | "&lt;div&gt;..." |
| `design_version` | Number | Iteration count | 1, 2, 3... |
| `approval_status` | Single Select | Design approval state | "draft", "pending", "approved", "rejected" |
| `tokens_used` | Number | OpenAI tokens consumed | 1250 |
| `metadata` | Long Text (JSON) | Additional context | {"acceptance_criteria": [...]} |

### Additional Tracking Fields

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | Text | Who initiated (if multi-user) |
| `monday_item_id` | Text | Reference to Monday.com item |
| `parent_message_id` | Number | References previous message |
| `is_iteration` | Checkbox | True if iterating on existing design |
| `error_message` | Long Text | If AI request failed |

---

## Table Structure (SQL for Postgres)

```sql
CREATE TABLE ux_conversations (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) NOT NULL CHECK (type IN ('user', 'ai', 'pm', 'system')),
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    story_id VARCHAR(100),
    requirements TEXT,
    html_output TEXT,
    design_version INTEGER DEFAULT 1,
    approval_status VARCHAR(50) DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected')),
    tokens_used INTEGER DEFAULT 0,
    metadata JSONB,
    user_id VARCHAR(255),
    monday_item_id VARCHAR(100),
    parent_message_id INTEGER REFERENCES ux_conversations(id),
    is_iteration BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    
    -- Indexes for fast queries
    INDEX idx_chat_id (chat_id),
    INDEX idx_session_id (session_id),
    INDEX idx_story_id (story_id),
    INDEX idx_created_at (created_at)
);
```

---

## Airtable Setup (Quick Start)

### Base Structure
**Base Name**: `UX Design Conversations`

**Table Name**: `Conversations`

**Fields to Create**:
1. **id** - Auto Number (automatically created)
2. **chat_id** - Single line text
3. **created_at** - Created time (automatic)
4. **type** - Single select: `user`, `ai`, `pm`, `system`
5. **role** - Single line text
6. **content** - Long text
7. **story_id** - Single line text
8. **requirements** - Long text
9. **html_output** - Long text
10. **design_version** - Number
11. **approval_status** - Single select: `draft`, `pending`, `approved`, `rejected`
12. **tokens_used** - Number
13. **metadata** - Long text (JSON)
14. **monday_item_id** - Single line text
15. **is_iteration** - Checkbox

**Views to Create**:
- **All Conversations** - Default grid view
- **By Chat ID** - Grouped by chat_id
- **Pending Approval** - Filter: approval_status = "pending"
- **Recent** - Sort by created_at descending

---

## Usage Patterns

### Pattern 1: New Design Request (PM Input)
```json
{
  "chat_id": "chat_abc123",
  "type": "pm",
  "role": "system",
  "content": "Requirements: Create a login page with email and password",
  "story_id": "STORY-123",
  "requirements": "Create a login page with email and password fields...",
  "design_version": 1,
  "approval_status": "draft",
  "metadata": {
    "acceptance_criteria": ["Email validation", "Password strength"],
    "source": "monday_webhook"
  }
}
```

### Pattern 2: AI Response
```json
{
  "chat_id": "chat_abc123",
  "type": "ai",
  "role": "assistant",
  "content": "I've created a modern login page with email validation...",
  "html_output": "<!DOCTYPE html>...",
  "design_version": 1,
  "tokens_used": 1250,
  "parent_message_id": 42
}
```

### Pattern 3: User Iteration
```json
{
  "chat_id": "chat_abc123",
  "type": "user",
  "role": "user",
  "content": "Make the login button blue and bigger",
  "design_version": 2,
  "is_iteration": true,
  "parent_message_id": 43
}
```

### Pattern 4: Approval
```json
{
  "chat_id": "chat_abc123",
  "type": "system",
  "role": "system",
  "content": "Design approved by John Doe",
  "approval_status": "approved",
  "design_version": 3,
  "metadata": {
    "approved_by": "John Doe",
    "approved_at": "2025-01-07T15:30:00Z"
  }
}
```

---

## Query Examples

### Get Conversation History for AI Context
```sql
SELECT 
  type,
  role,
  content,
  html_output,
  design_version,
  created_at
FROM ux_conversations
WHERE chat_id = 'chat_abc123'
ORDER BY created_at ASC;
```

### Get Latest Design Version
```sql
SELECT html_output, design_version
FROM ux_conversations
WHERE chat_id = 'chat_abc123' 
  AND type = 'ai'
  AND html_output IS NOT NULL
ORDER BY design_version DESC
LIMIT 1;
```

### Get All Messages for AI (OpenAI Format)
```sql
SELECT 
  role,
  content,
  CASE 
    WHEN html_output IS NOT NULL THEN content || '\n\nGenerated HTML:\n' || html_output
    ELSE content
  END as full_content
FROM ux_conversations
WHERE chat_id = 'chat_abc123'
  AND type IN ('user', 'ai', 'pm')
ORDER BY created_at ASC;
```

### Count Iterations per Session
```sql
SELECT 
  chat_id,
  COUNT(*) as message_count,
  MAX(design_version) as latest_version,
  COUNT(CASE WHEN type = 'user' THEN 1 END) as user_messages,
  COUNT(CASE WHEN type = 'ai' THEN 1 END) as ai_responses
FROM ux_conversations
GROUP BY chat_id;
```

---

## Data Retention Strategy

### Archiving Rules
- **Active conversations**: Last 30 days
- **Approved designs**: Keep forever (reference)
- **Rejected/abandoned**: Archive after 90 days
- **Conversation limit**: 50 messages per chat_id (archive old ones)

### Cleanup Query
```sql
-- Archive old draft conversations
UPDATE ux_conversations
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{archived}',
  'true'
)
WHERE approval_status = 'draft'
  AND created_at < NOW() - INTERVAL '90 days';
```

---

## Integration with n8n Workflow

### Nodes to Add:

1. **Save PM Request** (After "Build Context")
   - Insert into database
   - type: "pm", role: "system"

2. **Retrieve Conversation History** (Before "AI UX Designer")
   - Query last 20 messages for chat_id
   - Format for AI context

3. **Save User Message** (After "Build Context", if chat mode)
   - Insert user's feedback
   - type: "user", role: "user"

4. **Save AI Response** (After "Extract & Format HTML")
   - Insert AI's response + HTML
   - type: "ai", role: "assistant"
   - Increment design_version

5. **Update Approval Status** (Approval workflow)
   - Update approval_status field
   - Add approval metadata

---

## Benefits of This Schema

✅ **Complete Context**: AI sees full conversation history  
✅ **Version Tracking**: Every design iteration is numbered and stored  
✅ **Multi-session**: Can handle multiple concurrent design conversations  
✅ **Debugging**: Easy to see what went wrong in execution logs  
✅ **Analytics**: Track tokens used, iteration counts, approval rates  
✅ **Rollback**: Can retrieve any previous design version  
✅ **Audit Trail**: Know who said what and when  

---

## Next Steps

1. Choose database (Airtable for quick start, Postgres for production)
2. Create the table with fields above
3. Get API credentials (Airtable API key or Postgres connection string)
4. Update workflow to store/retrieve messages
5. Format conversation history for AI context

Ready to implement this? Let me know which database you prefer and I'll create the updated workflow!
