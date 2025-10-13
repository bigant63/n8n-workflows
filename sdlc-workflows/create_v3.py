#!/usr/bin/env python3
import json
import sys

# Read the current workflow
with open('02_ux_engineer_v2_with_history.json', 'r') as f:
    workflow = json.load(f)

# Update to v3
workflow['name'] = '03 - UX Engineer v3 - Enhanced Notes'
workflow['versionId'] = 'ux-v3.0-enhanced-notes-2025'

# Simpler, cleaner notes that n8n will definitely show
clean_notes = {
    "UX Chat Input": """USER ITERATION INPUT
====================

Receives design feedback from users.

POST /webhook/ux-chat
Body: {"message": "Make button blue", "chat_id": "STORY-001"}

Use for: Iterative design changes
Next: Merge Inputs""",

    "PM Requirements Input": """NEW DESIGN INPUT  
=================

Receives requirements from Product Manager.

POST /webhook/pm-to-ux
Body: {"story_id": "STORY-123", "requirements": "Create login page"}

Use for: Brand new designs
Next: Merge Inputs""",

    "Merge Inputs": """INPUT MERGER
============

Combines Chat + PM inputs into single stream.

Next: Build Context""",

    "Build Context": """CONTEXT BUILDER
===============

Normalizes inputs and creates structured context.

Creates:
- chatId (groups messages)
- inputType (chat or pm_requirement)
- userMessage, requirements, etc.

Next: Save Message + Retrieve History""",

    "Save User/PM Message": """SAVE TO AIRTABLE
================

Stores user/PM message in Conversations table.

Base: appWdPrlZVItMIbs7
Table: Conversations

Creates audit trail with chat_id grouping.

Next: Format History""",

    "Retrieve Conversation History": """RETRIEVE HISTORY
================

Fetches all previous messages for this chat_id.

Query: Filter by chat_id, sort by created_at
Limit: Last 20 messages

THE MAGIC: AI sees everything it built before!

Next: Format History""",

    "Format History for AI": """FORMAT FOR AI
=============

Converts Airtable records to AI-friendly format.

Creates:
- contextSummary (full conversation text)
- latestVersion (current: 2)
- newVersion (next: 3)

Example output:
[1] PM: Create login
[2] AI: [HTML generated]
[3] USER: Make blue
NEW: Add logo

Next: AI UX Designer""",

    "AI UX Designer": """AI DESIGNER (CONTEXT-AWARE!)
=============================

Generates HTML/CSS with full conversation memory.

Has access to:
- Original requirements
- All previous iterations  
- User feedback history
- HTML from previous versions

SMART: "Make it blue" = Changes existing button (not new!)

Next: Extract HTML""",

    "OpenAI GPT-4": """AI MODEL CONFIG
===============

Model: GPT-4 Turbo
Temperature: 0.3 (consistent output)
Max Tokens: 4000 (full HTML page)

Cost: ~$0.06 per iteration""",

    "Design Prompt with History": """DYNAMIC PROMPT
==============

Creates context-aware prompts for AI.

TWO MODES:
1. NEW: "Create design from requirements..."
2. ITERATE: "Update design with history..."

Includes full conversation context.""",

    "Extract & Format HTML": """HTML EXTRACTOR
==============

Extracts HTML from AI, adds CDN and watermark.

Outputs:
- html (complete with Tailwind CDN)
- version (v2, v3, v4...)
- aiResponse (explanation text)

Watermark: "v2 | Chat: abc... | 10:30"

Next: Save AI Response""",

    "Save AI Response": """SAVE AI DESIGN
==============

Stores AI-generated HTML in Airtable.

Stores:
- html_output (complete HTML)
- design_version (incremented)
- timestamp

Enables: Version history, rollback, AI memory

Next: Return Preview""",

    "Return HTML Preview": """RETURN PREVIEW
==============

Sends HTML to browser for instant preview.

Response: Complete HTML page
Headers: chat_id, version number

User sees:
- Live, functional design
- Responsive layout
- Ready to iterate further

WORKFLOW COMPLETE!"""
}

# Update all nodes with cleaner notes
for node in workflow['nodes']:
    # Get base name without emoji
    base_name = node['name'].replace('🔷 ', '').replace('🔶 ', '').replace('🔀 ', '').replace('🏗️ ', '').replace('💾 ', '').replace('📜 ', '').replace('🔄 ', '').replace('🤖 ', '').replace('🧠 ', '').replace('📝 ', '').replace('🔍 ', '').replace('🖥️ ', '')
    
    # Find matching note
    for key in clean_notes:
        if key in base_name:
            node['notes'] = clean_notes[key]
            print(f"✓ Updated: {node['name']}")
            break

# Save as v3
with open('03_ux_engineer_v3_enhanced_notes.json', 'w') as f:
    json.dump(workflow, f, indent=2)

print("\n✅ Created v3 with clean, readable notes!")
print("📁 File: 03_ux_engineer_v3_enhanced_notes.json")
print("📊 Notes format: Simple ASCII (no unicode issues)")
