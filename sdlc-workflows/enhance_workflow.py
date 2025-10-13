#!/usr/bin/env python3
import json

# Load the workflow
with open('02_ux_engineer_v2_with_history.json', 'r') as f:
    workflow = json.load(f)

# Enhanced notes for each node
enhanced_notes = {
    "UX Chat Input": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 UX CHAT INTERFACE (User Iteration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE:
Receives iterative design feedback from humans.

📥 INPUT: {"message": "Make the button blue", "chat_id": "STORY-001"}

🔗 ENDPOINT: POST /webhook/ux-chat

💡 USE FOR: Design refinements after initial creation

➡️ NEXT: Merge Inputs""",

    "PM Requirements Input": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRODUCT MANAGER INPUT (New Design)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE:
Receives NEW design requirements from PM workflow.

📥 INPUT: {"story_id": "STORY-123", "requirements": "Create login page"}

🔗 ENDPOINT: POST /webhook/pm-to-ux

💡 USE FOR: Brand new screens/components

➡️ NEXT: Merge Inputs""",

    "Merge Inputs": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 INPUT STREAM MERGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Combines Chat + PM inputs into single flow

➡️ NEXT: Build Context""",

    "Build Context": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ CONTEXT BUILDER & NORMALIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Normalizes inputs, generates chat_id

📋 CREATES:
• chatId - Groups messages (STORY-001)
• inputType - 'chat' or 'pm_requirement'
• userMessage, requirements, etc.

➡️ NEXT: Save Message + Retrieve History (parallel)""",

    "Save User/PM Message": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 SAVE MESSAGE TO AIRTABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Stores user/PM message in Airtable

📊 AIRTABLE: Base appWdPrlZVItMIbs7, Table Conversations

💡 CREATES: Audit trail record with chat_id

➡️ NEXT: Format History for AI""",

    "Retrieve Conversation History": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📜 RETRIEVE CONVERSATION HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Fetches ALL previous messages for this chat_id

🔍 QUERY: Filter by chat_id, sort oldest first, limit 20

💡 THE MAGIC: AI sees what it built before + all feedback!

➡️ NEXT: Format History for AI""",

    "Format History for AI": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 FORMAT HISTORY FOR AI CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Converts Airtable records to AI-friendly format

📤 CREATES:
• contextSummary - Full conversation text
• latestVersion - Current version (2)
• newVersion - Next version (3)

💡 EXAMPLE:
[1] PM: Create login
[2] AI: [HTML generated]
[3] USER: Make blue
NEW: Add logo

➡️ NEXT: AI UX Designer""",

    "AI UX Designer": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI UX ENGINEER (WITH FULL CONTEXT!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Generates HTML/CSS with conversation awareness

🧠 HAS ACCESS TO:
• Original requirements
• All previous iterations
• User feedback history
• HTML from previous versions

💡 SMART: "Make it blue" → Changes existing button (not new one!)

➡️ NEXT: Extract & Format HTML""",

    "OpenAI GPT-4": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI MODEL CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 MODEL: GPT-4 Turbo
⚙️ Temperature: 0.3 (consistent)
📏 Max Tokens: 4000 (full HTML page)

💰 COST: ~$0.06 per iteration""",

    "Design Prompt with History": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 DYNAMIC PROMPT BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Creates context-aware prompts

🔀 TWO MODES:
• NEW: "Create design from requirements..."
• ITERATE: "Update design with full history..."

💡 Includes conversation history so AI understands context""",

    "Extract & Format HTML": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 HTML EXTRACTOR & FORMATTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Extracts HTML, adds Tailwind CDN & watermark

📤 OUTPUTS:
• html - Complete with CDN
• version - Design version (v2, v3...)
• aiResponse - Explanation text

💡 WATERMARK: "v2 | Chat: abc... | 10:30"

➡️ NEXT: Save AI Response""",

    "Save AI Response": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 SAVE AI DESIGN TO AIRTABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Stores AI-generated design with version number

📊 STORES: html_output, design_version, timestamp

💡 ENABLES: Version history, rollback, AI references

➡️ NEXT: Return HTML Preview""",

    "Return HTML Preview": """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️ LIVE HTML PREVIEW RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PURPOSE: Returns HTML to browser for instant preview

📤 RESPONSE: Complete HTML page with headers

💡 USER SEES: Live, interactive design
- Fully functional
- Responsive
- Ready to iterate

✅ WORKFLOW COMPLETE!"""
}

# Update nodes
for node in workflow['nodes']:
    base_name = node['name']
    
    # Add emoji prefix
    if 'Chat Input' in base_name and '🔷' not in base_name:
        node['name'] = '🔷 ' + base_name
    elif 'PM' in base_name or 'Product Manager' in base_name:
        if '🔶' not in base_name:
            node['name'] = '🔶 ' + base_name
    elif 'Merge' in base_name and '🔀' not in base_name:
        node['name'] = '🔀 ' + base_name
    elif 'Build Context' in base_name and '🏗️' not in base_name:
        node['name'] = '🏗️ ' + base_name
    elif 'Save User' in base_name or ('Save' in base_name and 'Message' in base_name):
        if '💾' not in base_name:
            node['name'] = '💾 ' + base_name
    elif 'Retrieve' in base_name and '📜' not in base_name:
        node['name'] = '📜 ' + base_name
    elif 'Format' in base_name and '🔄' not in base_name:
        node['name'] = '🔄 ' + base_name
    elif 'AI UX' in base_name or 'AI Design' in base_name:
        if '🤖' not in base_name:
            node['name'] = '🤖 ' + base_name
    elif 'OpenAI' in base_name and '🧠' not in base_name:
        node['name'] = '🧠 ' + base_name
    elif 'Prompt' in base_name and '📝' not in base_name:
        node['name'] = '📝 ' + base_name
    elif 'Extract' in base_name and '🔍' not in base_name:
        node['name'] = '🔍 ' + base_name
    elif 'Save AI' in base_name:
        if '💾' not in base_name:
            node['name'] = '💾 ' + base_name
    elif 'Return' in base_name or 'Preview' in base_name:
        if '🖥️' not in base_name:
            node['name'] = '🖥️ ' + base_name
    
    # Update notes
    for key in enhanced_notes:
        if key in base_name:
            node['notes'] = enhanced_notes[key]
            break

# Save
with open('02_ux_engineer_v2_with_history.json', 'w') as f:
    json.dump(workflow, f, indent=2)

print("✅ Workflow enhanced!")
print(f"📊 Updated {len(workflow['nodes'])} nodes")
print("🎨 Added emoji prefixes")
print("📝 Enhanced documentation")
