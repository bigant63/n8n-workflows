// Script to update workflow notes with comprehensive documentation
// This will be used to generate the updated JSON

const enhancedNotes = {
  "webhook-ux-chat": `═══════════════════════════════════════
🔵 WEBHOOK INPUT: UX CHAT INTERFACE
═══════════════════════════════════════

PURPOSE:
Receives iterative design feedback from humans via chat interface

TRIGGER: POST /webhook/ux-chat

EXPECTED PAYLOAD:
{
  "message": "Make the button blue and bigger",
  "chat_id": "STORY-001" (optional - reuses existing conversation),
  "current_html": "<div>...</div>" (optional)
}

FLOW:
User sends feedback → This webhook receives → Merges with PM input → Continues to context builder

WHEN TO USE:
- Iterating on existing design
- Making changes: "add logo", "change color", "make bigger"
- Refining after initial creation

OUTPUT:
Passes message to next node for processing`,

  "webhook-pm-input": `═══════════════════════════════════════
🟠 WEBHOOK INPUT: PRODUCT MANAGER
═══════════════════════════════════════

PURPOSE:
Receives new design requirements from Product Manager workflow

TRIGGER: POST /webhook/pm-to-ux

EXPECTED PAYLOAD:
{
  "story_id": "STORY-123",
  "requirements": "Create a modern login page...",
  "acceptance_criteria": ["Email validation", "Password toggle"],
  "monday_item_id": "12345" (optional)
}

FLOW:
PM defines requirements → This webhook receives → Merges with chat input → Continues to context builder

WHEN TO USE:
- Starting a new design from scratch
- PM provides initial requirements
- Monday.com automation triggers this

OUTPUT:
Passes requirements to next node for processing`,

  "merge-inputs": `═══════════════════════════════════════
🟣 DATA COMBINER
═══════════════════════════════════════

PURPOSE:
Merges both webhook inputs (Chat + PM) into single unified stream

WHY NEEDED:
Workflow can be triggered from 2 different sources:
1. Chat interface (human iterating)
2. PM workflow (new requirements)

This node ensures both paths converge into one flow

OPERATION:
- Mode: Combine
- Method: Merge by position
- Output: Single data stream with all input data

FLOW:
Chat Webhook ──┐
               ├──> Merged Output → Context Builder
PM Webhook ────┘

OUTPUT:
Combined data object with all fields from both sources`,

  "build-context": `═══════════════════════════════════════
🟢 CONTEXT BUILDER & NORMALIZER
═══════════════════════════════════════

PURPOSE:
Extracts and normalizes all input data into consistent structure

CRITICAL FUNCTIONS:
1. Generates chat_id if not provided (groups conversation)
2. Determines input type (chat vs PM requirement)
3. Extracts all relevant fields
4. Structures data for downstream nodes

FIELD MAPPING:
✓ chatId: Groups related messages (same design)
✓ inputType: "chat" or "pm_requirement"
✓ userMessage: Feedback text (if chat)
✓ requirements: Full requirements (if PM)
✓ acceptanceCriteria: List of must-haves
✓ storyId: Monday.com story reference
✓ mondayItemId: Monday.com item ID

LOGIC:
- chat_id priority: explicit > session_id > story_id > auto-generate
- inputType: Has "message" field? = chat, else = pm_requirement

OUTPUT:
Clean, structured object ready for database and AI processing`,

  "save-user-message": `═══════════════════════════════════════
💾 DATABASE: SAVE USER/PM MESSAGE
═══════════════════════════════════════

PURPOSE:
Stores user feedback or PM requirements in Airtable for conversation history

AIRTABLE WRITE:
Table: Conversations
Operation: Append (create new record)

FIELDS WRITTEN:
• chat_id: Groups conversation
• type: "user" (if chat) or "pm" (if PM input)
• role: "user" (if chat) or "system" (if PM)
• content: The actual message/requirements
• story_id: Reference to story
• requirements: Full PM requirements (if applicable)
• design_version: 1 (initial)
• approval_status: "draft"
• is_iteration: true (if chat), false (if PM)
• metadata: JSON with acceptance_criteria
• monday_item_id: Reference to Monday.com

WHY IMPORTANT:
Creates audit trail of what user/PM requested
Enables AI to see full conversation history
Tracks iterations and changes over time

OUTPUT:
Airtable record ID and confirmation`,

  "retrieve-history": `═══════════════════════════════════════
📜 DATABASE: RETRIEVE CONVERSATION HISTORY
═══════════════════════════════════════

PURPOSE:
Fetches all previous messages for this chat_id to give AI context

AIRTABLE QUERY:
Table: Conversations
Filter: chat_id = current session
Sort: created_at ASC (oldest first)
Limit: 20 messages (prevents token overflow)

RETURNS:
All previous messages including:
• PM requirements (type="pm")
• User feedback (type="user")
• AI responses (type="ai")
• Generated HTML from previous iterations

WHY CRITICAL:
Without this, AI has NO MEMORY!
AI needs to see:
- Original requirements
- What it built before
- What user asked to change
- Evolution of the design

EXAMPLE OUTPUT:
[
  {chat_id: "abc", type: "pm", content: "Create login..."},
  {chat_id: "abc", type: "ai", html_output: "<form>..."},
  {chat_id: "abc", type: "user", content: "Make button blue"},
  {chat_id: "abc", type: "ai", html_output: "<form blue>..."}
]

All messages with same chat_id = complete conversation!`,

  "format-history": `═══════════════════════════════════════
🔄 DATA TRANSFORMER: FORMAT AI CONTEXT
═══════════════════════════════════════

PURPOSE:
Converts Airtable records into format AI can understand

JAVASCRIPT PROCESSING:
1. Loops through all retrieved messages
2. Tracks latest version number
3. Captures original PM requirements
4. Builds chronological conversation summary
5. Includes HTML snippets from previous AI responses

OUTPUT STRUCTURE:
{
  messages: [
    {role: "system", content: "Original requirements..."},
    {role: "user", content: "Make button blue"},
    {role: "assistant", content: "Updated design..."}
  ],
  contextSummary: "Full formatted context for AI",
  latestVersion: 2,
  newVersion: 3,
  originalRequirements: "Create login page...",
  chatId: "abc123"
}

CONTEXT SUMMARY INCLUDES:
=== CONVERSATION CONTEXT ===
Chat ID: abc123
Original Requirements: Create login page...
Current Version: 2
Total Messages: 4

=== CONVERSATION HISTORY ===
[1] PM: Create login page with email/password
[2] AI: [Generated HTML v1 with green button]
[3] USER: Make the button blue
[4] AI: [Updated HTML v2 with blue button]

=== NEW REQUEST ===
User: Add company logo at top

WHY IMPORTANT:
AI sees COMPLETE context of conversation
Understands what was requested, what it built, what changed
Makes intelligent updates instead of starting over`,

  "ai-design-agent": `═══════════════════════════════════════
🤖 AI DESIGNER: GPT-4 WITH FULL CONTEXT
═══════════════════════════════════════

PURPOSE:
Generates or updates HTML/CSS design based on requirements and full conversation history

AI MODEL: GPT-4 Turbo
Temperature: 0.3 (balanced creativity/consistency)
Max Tokens: 4000 (enough for full HTML page)

CONTEXT PROVIDED TO AI:
✓ Original PM requirements
✓ All previous user feedback
✓ HTML from previous versions
✓ Current iteration number
✓ What changed in each version
✓ New request/feedback

AI CAPABILITIES:
• Creates initial designs from requirements
• Iterates on existing designs
• Understands "it", "the button", "that form"
• Maintains design consistency
• Uses Tailwind CSS
• Generates responsive, accessible HTML
• Explains design decisions

PROMPT STRUCTURE:
IF new design (PM input):
  "Create beautiful HTML/CSS for: [requirements]"
  
IF iteration (user feedback):
  "You previously built: [HTML v2]
   User now says: [Make button blue]
   Update ONLY what user requested, keep everything else"

OUTPUT:
AI response with HTML code in markdown code blocks
Explanation of changes made
Design rationale

WHY IMPORTANT:
This is where the magic happens!
AI with context = smart, precise updates
AI without context = confused, regenerates everything`,

  "openai-model": `═══════════════════════════════════════
🧠 AI MODEL CONFIGURATION
═══════════════════════════════════════

MODEL: GPT-4 Turbo Preview
Provider: OpenAI

SETTINGS:
• Temperature: 0.3
  (Low = consistent, High = creative)
  0.3 = Balanced for design work
  
• Max Tokens: 4000
  (Enough for full HTML page + explanation)

WHY GPT-4 TURBO:
✓ Best at following complex instructions
✓ Understands context well
✓ Generates clean, semantic HTML
✓ Good at maintaining consistency
✓ Handles Tailwind CSS well

COST PER REQUEST:
~$0.06 per design iteration
(Slightly more than v1 due to history context)

CREDENTIALS:
Requires OpenAI API key with credits`,

  "prompt-template": `═══════════════════════════════════════
📝 DYNAMIC PROMPT GENERATOR
═══════════════════════════════════════

PURPOSE:
Builds custom prompt for AI based on input type and conversation history

PROMPT STRUCTURE:

FOR NEW DESIGNS (PM):
"You are an expert UX Engineer.

[FULL CONVERSATION CONTEXT SUMMARY]

Create a beautiful, modern HTML/CSS design for:
Requirements: [requirements]
Acceptance Criteria: [list]

Use:
1. Tailwind CSS (CDN available)
2. Responsive design
3. Accessibility features
4. Modern aesthetics

Return ONLY the HTML code inside \`\`\`html code block"

FOR ITERATIONS (Chat):
"You are an expert UX Engineer with access to full history.

[FULL CONVERSATION CONTEXT SUMMARY]
[SHOWS: Original requirements, previous versions, what you built]

INSTRUCTIONS:
1. Review conversation history above
2. Understand what has been built (see previous HTML)
3. Apply latest feedback: '[user message]'
4. Return COMPLETE updated HTML inside \`\`\`html code block
5. Only change what user requested, keep everything else same"

CONTEXT SUMMARY INCLUDES:
• Original requirements
• All previous messages
• Snippets of HTML from previous versions
• Version numbers
• What changed each time

WHY DYNAMIC:
Different prompts for different scenarios ensures AI understands context appropriately`,

  "extract-html": `═══════════════════════════════════════
🔍 HTML EXTRACTOR & FORMATTER
═══════════════════════════════════════

PURPOSE:
Extracts clean HTML from AI response and creates complete preview-ready page

JAVASCRIPT PROCESSING:

1. EXTRACT HTML:
   - AI returns HTML in markdown: \`\`\`html ... \`\`\`
   - Regex extracts just the HTML code
   - Removes markdown formatting

2. BUILD COMPLETE PAGE:
   - Adds <!DOCTYPE html>
   - Adds <head> with Tailwind CDN
   - Wraps extracted HTML in <body>
   - Adds version watermark (shows session ID + version + time)

3. OUTPUT STRUCTURE:
   {
     html: "Complete preview-ready HTML",
     rawHtml: "Just the AI-generated HTML",
     chatId: "abc123",
     version: 3,
     timestamp: "2025-01-07T...",
     aiResponse: "AI's explanation text"
   }

WATERMARK INCLUDES:
• Version number (v1, v2, v3...)
• Chat ID (first 8 chars)
• Current timestamp
• Positioned bottom-right, semi-transparent

WHY IMPORTANT:
Creates ready-to-view HTML page
Tracks which version user is viewing
Separates HTML from AI explanation text`,

  "save-ai-response": `═══════════════════════════════════════
💾 DATABASE: SAVE AI DESIGN
═══════════════════════════════════════

PURPOSE:
Stores AI-generated design and response in Airtable

AIRTABLE WRITE:
Table: Conversations
Operation: Append (create new record)

FIELDS WRITTEN:
• chat_id: Groups conversation (same as user message)
• type: "ai"
• role: "assistant"
• content: AI's explanation text
• html_output: COMPLETE generated HTML page
• design_version: Incremented from previous
• approval_status: "draft"
• is_iteration: true
• tokens_used: (if available from API)

WHY IMPORTANT:
✓ Stores complete HTML for each version
✓ Enables version history and rollback
✓ Creates audit trail of AI decisions
✓ Allows future retrieval of any version
✓ Tracks design evolution

CONVERSATION PATTERN:
User message (type="user") 
  → AI response (type="ai")
  → User feedback (type="user")
  → AI update (type="ai")
  
All with same chat_id = complete conversation!

OUTPUT:
Airtable record ID and confirmation`,

  "respond-preview": `═══════════════════════════════════════
🖥️ HTTP RESPONSE: LIVE HTML PREVIEW
═══════════════════════════════════════

PURPOSE:
Returns complete HTML directly to browser for immediate preview

RESPONSE TYPE: text/html
Response Mode: Last Node (waits for all processing)

RESPONSE BODY:
Complete HTML page from "Extract HTML" node
Includes Tailwind CSS, design, and version watermark

CUSTOM HEADERS:
• Content-Type: text/html; charset=utf-8
• Cache-Control: no-cache (always fresh)
• X-Chat-ID: [session ID] (for tracking)
• X-Design-Version: [version number] (for tracking)

USER EXPERIENCE:
1. User sends POST request
2. Workflow processes (5-10 seconds)
3. Browser receives HTML
4. HTML renders immediately
5. User sees live, interactive design!

CAN BE VIEWED:
✓ Direct browser URL
✓ Embedded in iframe
✓ In Postman/Insomnia
✓ Custom chat interface
✓ Mobile app

WHY THIS APPROACH:
• Instant visual feedback
• No file storage needed
• Real interactivity (buttons, forms work)
• Easy to embed in chat UI
• Version watermark for tracking

OUTPUT:
Live, renderable HTML page displayed in browser`
};

console.log('Enhanced notes ready for workflow update!');
console.log('Total nodes documented:', Object.keys(enhancedNotes).length);
