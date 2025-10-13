# UX Engineer Workflow - Complete Design Document

## Overview
Interactive design workflow that allows humans to chat with AI to iterate on UI designs, with live HTML/CSS preview capabilities.

## Key Design Decision: HTML/CSS vs Images

**Winner: HTML/CSS Code Generation**

### Why Code Beats Images:
1. **Token Cost**: 500-2000 tokens vs 5000+ tokens for image generation
2. **Iteration Speed**: Instant surgical edits vs full regeneration
3. **Precision**: Pixel-perfect control and responsive design
4. **Interactivity**: Real clickable elements, not static mockups
5. **Handoff**: Engineers get production-ready code, not screenshots

### Image Approach (Not Recommended):
- Would use OpenAI DALL-E or Stability AI node
- Returns base64 or URL
- Display via: HTTP Response node (embed in HTML), Email node, or file write
- Much slower iteration cycle

## Workflow Architecture

### Node Flow Diagram

```
[Webhook: UX Chat] ──┐
                      ├──> [Merge Inputs] ──> [Build Context] ──> [Retrieve History]
[Webhook: PM Input] ──┘                                                    │
                                                                           ↓
                                                                    [AI Design Agent]
                                                                           │
                                                                           ├──> [Generate/Update HTML]
                                                                           │
                                                                           ├──> [Store Version]
                                                                           │
                                                                           ├──> [HTTP Preview Response]
                                                                           │
                                                                           └──> [Approval Gate]
                                                                                      │
                                                                         [Approved?] ─┴─> [Notify SE Workflow]
```

## Detailed Node Configuration

### 1. Webhook: UX Chat Interface
**Type**: Webhook Trigger  
**Path**: `/webhook/ux-chat`  
**Method**: POST  

**Purpose**: Receives user messages for iterative design improvements.

**Request Body**:
```json
{
  "message": "Make the login button blue and larger",
  "session_id": "uuid-session-123",
  "design_version": 3,
  "current_html": "<div class='container'>...</div>"
}
```

**Node Configuration**:
- HTTP Method: POST
- Response Mode: "Last Node" (will respond with preview HTML)
- Authentication: None (or API key if public-facing)

**Documentation Notes for Node**:
```
📝 UX CHAT INPUT WEBHOOK

Receives iterative design feedback from humans via chat interface.

Expected Payload:
- message: User's design change request
- session_id: Conversation/project identifier
- design_version: Current version number
- current_html: Existing design code (if iterating)

Example: "Make the header sticky and add a shadow"

Endpoint: POST /webhook/ux-chat
```

---

### 2. Webhook: PM Requirements Input  
**Type**: Webhook Trigger  
**Path**: `/webhook/pm-to-ux`  
**Method**: POST  

**Purpose**: Receives initial requirements from Product Manager workflow.

**Request Body**:
```json
{
  "story_id": "STORY-456",
  "title": "User Dashboard Screen",
  "requirements": "Create a dashboard with user stats, recent activity feed, and action buttons",
  "acceptance_criteria": [
    "Display user name and avatar",
    "Show last 5 activities",
    "Include Edit Profile and Logout buttons"
  ],
  "monday_item_id": "67890",
  "priority": "high"
}
```

**Documentation Notes for Node**:
```
🎯 PRODUCT MANAGER INPUT WEBHOOK

Receives new design requirements from PM workflow.
Creates initial design based on user story.

Expected Payload:
- story_id: Reference ID from Monday.com
- title: Story title
- requirements: Detailed requirements
- acceptance_criteria: List of must-haves
- monday_item_id: Monday.com item ID
- priority: high/medium/low

Endpoint: POST /webhook/pm-to-ux
Triggered by: Product Manager workflow completion
```

---

### 3. Merge Inputs
**Type**: Merge Node  
**Mode**: Combine All

**Purpose**: Combines chat and PM webhook inputs into single flow.

**Documentation Notes**:
```
🔀 INPUT STREAM MERGER

Combines both input sources (chat + PM requirements).
Allows workflow to handle both scenarios uniformly.

Output: Single stream with all input data merged.
```

---

### 4. Build Context
**Type**: Set Node (n8n-nodes-base.set)  

**Purpose**: Normalize and structure all input data into consistent format.

**Field Assignments**:
{{ storyId }})

Requirements:
{{ pmRequirements }}

Acceptance Criteria:
{{#each acceptanceCriteria}}
- {{ this }}
{{/each}}

Priority: {{ priority }}

Please create an initial HTML/CSS design that meets these requirements.
Include:
1. Complete HTML structure
2. Embedded CSS (using <style> tag)
3. Responsive design (mobile-first)
4. Accessibility features
5. Brief design notes explaining your choices

{{else}}
DESIGN ITERATION REQUEST

Session: {{ sessionId }}
Current Version: v{{ designVersion }}

User Feedback: "{{ userMessage }}"

Current Design:
```html
{{ currentHtml }}
```

Previous Context:
{{ conversationHistory }}

Please update the design based on the user's feedback.
Provide:
1. Updated HTML/CSS code
2. Explanation of changes made
3. Any design suggestions or considerations
{{/if}}
```

**Model Settings**:
- Model: `gpt-4-turbo-preview` or `claude-sonnet-4-5`
- Temperature: 0.3 (balanced creativity/consistency)
- Max Tokens: 4000 (enough for full HTML page)

**Documentation Notes**:
```
🤖 AI UX ENGINEER AGENT

Generates or updates HTML/CSS designs.

Capabilities:
- Creates initial designs from PM requirements
- Iterates based on user feedback
- Maintains design consistency
- Follows web best practices
- Provides design rationale

Input Context:
- Requirements/feedback
- Conversation history
- Current design (if iterating)
- Acceptance criteria

Output:
- HTML/CSS code
- Design explanation
- Improvement suggestions

Model: GPT-4 Turbo or Claude Sonnet
Temperature: 0.3 for consistency
```

---

### 7. Extract HTML Code
**Type**: Code Node (JavaScript)

**Purpose**: Parse AI response and extract clean HTML/CSS code.

**Code**:
```javascript
const aiResponse = $input.first().json.choices[0].message.content;

// Extract HTML code from markdown code blocks
const htmlMatch = aiResponse.match(/```html\n([\s\S]*?)```/);
const html = htmlMatch ? htmlMatch[1] : aiResponse;

// Extract design notes
const notesMatch = aiResponse.match(/(?:Design Notes?|Explanation):\s*([\s\S]*?)(?:```|$)/i);
const designNotes = notesMatch ? notesMatch[1].trim() : '';

// Build complete HTML with Tailwind CDN
const completeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UX Preview - v${$json.designVersion}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles from AI */
        ${html.includes('<style>') ? '' : ''}
    </style>
</head>
<body>
    ${html}
    
    <!-- Version Info -->
    <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace;">
        v${$json.designVersion} | Session: ${$json.sessionId.slice(0, 8)}
    </div>
</body>
</html>
`;

return [{
  json: {
    html: completeHtml,
    rawHtml: html,
    designNotes: designNotes,
    version: $json.designVersion,
    sessionId: $json.sessionId,
    timestamp: new Date().toISOString()
  }
}];
```

**Documentation Notes**:
```
🔍 HTML CODE EXTRACTOR

Parses AI response and extracts clean HTML/CSS.

Process:
1. Extract HTML from markdown code blocks
2. Parse out design notes/explanation
3. Add Tailwind CDN link
4. Insert version watermark
5. Create complete, preview-ready HTML

Output:
- html: Complete preview HTML
- rawHtml: Just the generated code
- designNotes: AI's explanation
- version: Design version number
- sessionId: Tracking ID
```

---

### 8. Store Design Version
**Type**: Pinecone Insert (Vector Store)

**Purpose**: Save design iteration to vector database for history.

**Configuration**:
- Operation: Insert/Upsert
- Text to Embed: 
```
Design v{{ version }} for {{ sessionId }}
{{ inputType === 'chat' ? 'User: ' + userMessage : 'PM: ' + pmRequirements }}
Design Notes: {{ designNotes }}
HTML: {{ rawHtml.slice(0, 500) }}...
```

**Metadata**:
```json
{
  "session_id": "{{ sessionId }}",
  "version": {{ version }},
  "input_type": "{{ inputType }}",
  "story_id": "{{ storyId }}",
  "timestamp": "{{ timestamp }}",
  "type": "ux_design_version"
}
```

**Documentation Notes**:
```
💾 VERSION STORAGE

Stores design iteration in Pinecone vector database.

Stored Data:
- Complete HTML/CSS code
- Design version number
- User feedback/requirements
- Design explanation
- Timestamp and session ID

Purpose:
- Enable conversation history retrieval
- Track design evolution
- Allow rollback if needed
- Build design documentation

Database: Pinecone vector store
Index: ux-design-memory
```

---

### 9. Generate Preview URL
**Type**: Set Node

**Purpose**: Create shareable preview URL for the design.

**Configuration**:
```javascript
{
  previewUrl: `https://your-n8n-domain.com/webhook/ux-preview/${$json.sessionId}/${$json.version}`,
  downloadUrl: `https://your-n8n-domain.com/webhook/ux-download/${$json.sessionId}/${$json.version}`,
  approvalUrl: `https://your-n8n-domain.com/webhook/ux-approve/${$json.sessionId}/${$json.version}`
}
```

**Documentation Notes**:
```
🔗 URL GENERATOR

Creates shareable URLs for design preview and actions.

Generated URLs:
- previewUrl: Live HTML preview
- downloadUrl: Download HTML file
- approvalUrl: Approve and send to SE workflow

These URLs are returned to the user for interaction.
```

---

### 10. HTTP Response - Preview
**Type**: Respond to Webhook

**Purpose**: Send HTML preview back to user or display in browser.

**Response Mode**: Text/HTML

**Response Body**:
```javascript
{{$json.html}}
```

**Headers**:
```
Content-Type: text/html; charset=utf-8
Cache-Control: no-cache
X-Design-Version: {{$json.version}}
X-Session-ID: {{$json.sessionId}}
```

**Documentation Notes**:
```
🖥️ LIVE PREVIEW RESPONSE

Returns complete HTML for browser rendering.

Response Type: text/html
Headers: Include version and session metadata

User sees live, interactive preview immediately.

Can be embedded in:
- iframe in chat interface
- New browser tab
- Mobile preview app
- Design review tool
```

---

### 11. Update Monday.com Item
**Type**: Monday.com (or HTTP Request to Monday API)

**Purpose**: Update the story item with design status and preview link.

**Configuration**:
```javascript
mutation {
  change_multiple_column_values(
    item_id: {{$json.mondayItemId}},
    board_id: {{TASKS_BOARD_ID}},
    column_values: "{
      \"status\": {\"label\": \"UX In Progress\"},
      \"text_column\": \"Design v{{$json.version}} ready for review\",
      \"link\": {\"url\": \"{{$json.previewUrl}}\", \"text\": \"View Design\"}
    }"
  ) {
    id
  }
}
```

**Documentation Notes**:
```
📊 MONDAY.COM UPDATE

Updates the story item in Monday.com with design status.

Updates:
- Status: "UX In Progress" → "UX Review"
- Adds preview link to item
- Updates version number
- Adds timestamp

Keeps PM and stakeholders informed of progress.
```

---

### 12. Approval Gate (Manual)
**Type**: Wait Node + Webhook

**Purpose**: Pause for human approval before passing to Software Engineer.

**Wait Configuration**:
- Type: Webhook
- Resume Webhook Path: `/webhook/ux-approve/:sessionId/:version`
- Timeout: 7 days

**Documentation Notes**:
```
✋ HUMAN APPROVAL GATE

Pauses workflow until human approves design.

Approval Methods:
1. Click approval URL in response
2. Send approval via chat interface  
3. Approve in Monday.com item

Resume Trigger:
POST /webhook/ux-approve/{sessionId}/{version}

Payload: { approved: true/false, feedback: "optional" }

Timeout: 7 days (auto-reject after)

CRITICAL: No design moves to SE without approval!
```

---

### 13. If Approved
**Type**: IF Node

**Condition**: `{{$json.approved === true}}`

**Documentation Notes**:
```
✅ APPROVAL CHECK

Routes workflow based on approval status.

IF approved = true:
  → Proceed to Software Engineer workflow
  → Update Monday status to "Approved"
  → Store final design version

IF approved = false:
  → Return to chat for more iterations
  → Increment version number
  → Keep in UX phase

Decision Point: Determines if design moves to implementation.
```

---

### 14. Trigger Software Engineer Workflow
**Type**: HTTP Request (Webhook) or Execute Workflow

**Purpose**: Pass approved design to Software Engineer workflow.

**Request Configuration**:
```
POST /webhook/se-implement


Body:
{
  "story_id": "{{$json.storyId}}",
  "design_html": "{{$json.html}}",
  "design_version": {{$json.version}},
  "design_notes": "{{$json.designNotes}}",
  "requirements": "{{$json.pmRequirements}}",
  "acceptance_criteria": {{$json.acceptanceCriteria}},
  "monday_item_id": "{{$json.mondayItemId}}",
  "ux_approved_by": "{{$json.approvedBy}}",
  "ux_approved_at": "{{$json.timestamp}}"
}
```

**Documentation Notes**:
```
🚀 TRIGGER SOFTWARE ENGINEER

Hands off approved design to SE workflow.

Payload Includes:
- Final HTML/CSS code
- Design documentation
- Original requirements
- Acceptance criteria
- Monday.com item reference
- Approval metadata

SE workflow will:
1. Convert design to production code
2. Add functionality/logic
3. Write tests
4. Commit to git repo
5. Deploy to test environment

End of UX phase, start of implementation phase.
```

---

### 15. Final Response - Chat Interface
**Type**: Respond to Webhook (if from chat)

**Purpose**: Send confirmation message back to chat interface.

**Response** (JSON):
```json
{
  "status": "approved",
  "message": "🎉 Design v{{version}} approved and sent to Software Engineer!",
  "preview_url": "{{previewUrl}}",
  "next_steps": [
    "SE workflow will implement the design",
    "You'll be notified when code is ready for QA",
    "Track progress in Monday.com"
  ],
  "timeline": "Estimated completion: 2-3 days",
  "monday_item": "{{mondayItemId}}"
}
```

**Documentation Notes**:
```
💬 CHAT RESPONSE - APPROVED

Sends success message back to user's chat interface.

Response includes:
- Approval confirmation
- Preview URL for reference
- Next steps in SDLC
- Timeline estimate
- Monday.com tracking link

User knows design phase is complete and implementation begins.
```

---

## Additional Support Endpoints

### Preview Endpoint (Separate Webhook)
**Path**: `/webhook/ux-preview/:sessionId/:version`  
**Method**: GET  
**Purpose**: Retrieve and display any previous version

**Flow**:
1. Parse sessionId and version from URL
2. Query Pinecone for that specific version
3. Return HTML from stored design
4. Include version selector dropdown

---

### Download Endpoint
**Path**: `/webhook/ux-download/:sessionId/:version`  
**Method**: GET  
**Purpose**: Download HTML file

**Response Headers**:
```
Content-Type: text/html
Content-Disposition: attachment; filename="design-v{{version}}.html"
```

---

## Complete Chat Interface Example

### Frontend (Simple HTML/JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UX Engineer Chat</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-4 max-w-6xl">
        <div class="grid grid-cols-2 gap-4 h-screen">
            <!-- Chat Panel -->
            <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                <h2 class="text-2xl font-bold mb-4">UX Engineer Chat</h2>
                <div id="messages" class="flex-1 overflow-y-auto mb-4 space-y-2">
                    <!-- Messages appear here -->
                </div>
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="messageInput" 
                        placeholder="Describe your design change..."
                        class="flex-1 border rounded px-4 py-2"
                    />
                    <button 
                        onclick="sendMessage()"
                        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    Session: <span id="sessionId">-</span> | 
                    Version: <span id="version">1</span>
                </div>
            </div>

            <!-- Preview Panel -->
            <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Live Preview</h2>
                    <div class="flex gap-2">
                        <button onclick="refreshPreview()" class="text-blue-500 hover:underline">
                            Refresh
                        </button>
                        <button onclick="downloadDesign()" class="text-green-500 hover:underline">
                            Download
                        </button>
                        <button onclick="approveDesign()" class="text-purple-500 hover:underline font-bold">
                            ✓ Approve
                        </button>
                    </div>
                </div>
                <iframe 
                    id="preview" 
                    class="flex-1 border rounded w-full"
                    sandbox="allow-scripts"
                ></iframe>
            </div>
        </div>
    </div>

    <script>
        let sessionId = 'session_' + Date.now();
        let currentVersion = 1;
        let currentHtml = '';

        document.getElementById('sessionId').textContent = sessionId.slice(0, 12) + '...';

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;

            // Add user message to chat
            addMessage('You', message, 'user');
            input.value = '';

            // Send to n8n workflow
            const response = await fetch('https://your-n8n-domain.com/webhook/ux-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId,
                    design_version: currentVersion,
                    current_html: currentHtml
                })
            });

            // Get updated design
            const html = await response.text();
            currentHtml = html;
            currentVersion++;
            
            document.getElementById('version').textContent = currentVersion;
            document.getElementById('preview').srcdoc = html;

            addMessage('AI', 'Design updated! Check the preview.', 'ai');
        }

        function addMessage(sender, text, type) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `p-3 rounded ${type === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`;
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function refreshPreview() {
            document.getElementById('preview').src = document.getElementById('preview').src;
        }

        function downloadDesign() {
            const blob = new Blob([currentHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `design-v${currentVersion}.html`;
            a.click();
        }

        async function approveDesign() {
            if (!confirm('Approve this design and send to Software Engineer?')) return;

            await fetch(`https://your-n8n-domain.com/webhook/ux-approve/${sessionId}/${currentVersion}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    approved: true,
                    approved_by: 'User Name'
                })
            });

            alert('✅ Design approved! Software Engineer workflow triggered.');
        }

        // Initialize with a welcome message
        addMessage('AI', 'Hi! I\'m your UX Engineer AI. Describe the interface you want to create, or give me feedback on the current design.', 'ai');
    </script>
</body>
</html>
```

---

## Environment Variables Needed

```env
# n8n Configuration
N8N_HOST=your-n8n-domain.com
N8N_PROTOCOL=https

# AI Model
OPENAI_API_KEY=sk-proj-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Vector Database
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=ux-design-memory

# Monday.com
MONDAY_API_TOKEN=your-token
MONDAY_TASKS_BOARD_ID=12345678

# Project Context
DEFAULT_SESSION_TIMEOUT=7d
MAX_DESIGN_VERSIONS=50
```

---

## Testing the Workflow

### Test 1: PM Requirement (New Design)
```bash
curl -X POST https://your-n8n.com/webhook/pm-to-ux \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "STORY-TEST-001",
    "title": "Login Screen",
    "requirements": "Create a modern login form with email and password fields, remember me checkbox, and forgot password link",
    "acceptance_criteria": [
      "Email validation",
      "Password show/hide toggle",
      "Responsive design"
    ],
    "monday_item_id": "999999"
  }'
```

### Test 2: Chat Iteration
```bash
curl -X POST https://your-n8n.com/webhook/ux-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Make the login button bigger and change it to blue",
    "session_id": "session_test_001",
    "design_version": 1,
    "current_html": "<div>...</div>"
  }'
```

### Test 3: Approval
```bash
curl -X POST https://your-n8n.com/webhook/ux-approve/session_test_001/2 \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "approved_by": "John Doe",
    "feedback": "Looks great!"
  }'
```

---

## Viewing Designs in n8n

### Option 1: HTTP Response Node
The simplest way - the response IS the preview. Open in browser.

### Option 2: File Write + Static Server
```javascript
// In Code node before response
const fs = require('fs');
const path = `/tmp/ux-previews/${$json.sessionId}_v${$json.version}.html`;
fs.writeFileSync(path, $json.html);

// Then serve via nginx or simple HTTP server
// Access at: http://localhost:8080/previews/session_xxx_v2.html
```

### Option 3: Base64 Data URL (Chat Embed)
```javascript
const base64 = Buffer.from($json.html).toString('base64');
const dataUrl = `data:text/html;base64,${base64}`;

// Return this in chat response
// Frontend can set: iframe.src = dataUrl;
```

### Option 4: External Preview Service
- Deploy to Vercel/Netlify via API
- Use CodePen API
- Use StackBlitz API
- Store in S3 + CloudFront

---

## Cost Analysis

### Per Design Iteration:
- GPT-4 Turbo: ~$0.03 - $0.08 (depending on context)
- Claude Sonnet: ~$0.015 - $0.04
- Pinecone Storage: ~$0.0001 per vector
- n8n Execution: Free (self-hosted) or ~$0.01 (cloud)

**Total per iteration: ~$0.05 - $0.10**

Compare to image generation:
- DALL-E 3: $0.04 - $0.12 per image
- Stability AI: $0.02 - $0.08 per image
- But: Can't iterate easily, need full regen

**HTML/CSS is 50-70% cheaper for iterative work!**

---

## Success Metrics

Track these in Monday.com or analytics:

1. **Average iterations per design**: Target < 5
2. **Time to approval**: Target < 2 hours
3. **Approval rate**: Target > 90%
4. **Cost per approved design**: Target < $0.50
5. **User satisfaction**: Survey after approval

---

## Next Steps

1. ✅ **Read this document** - Understand the architecture
2. 🛠️ **Build in n8n UI** - Create nodes following this spec
3. 🧪 **Test thoroughly** - Use the test commands above
4. 🎨 **Deploy chat interface** - Host the HTML frontend
5. 🔗 **Integrate with PM workflow** - Connect the webhooks
6. 📊 **Monitor and optimize** - Track metrics and improve

---

**Documentation Complete!**  
Ready to build? Start with nodes 1-6, test, then add the rest.
