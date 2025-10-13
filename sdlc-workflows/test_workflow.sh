#!/bin/bash

# Test UX Workflow - Run this after importing workflow to n8n

echo "🧪 Testing UX Engineer Workflow v2"
echo "=================================="
echo ""

# You need to fill in your n8n webhook URL
# Find it in n8n: Open workflow → Click webhook node → Copy URL
read -p "Enter your n8n webhook URL (e.g., http://localhost:5678/webhook/pm-to-ux): " WEBHOOK_URL

if [ -z "$WEBHOOK_URL" ]; then
    echo "❌ Error: Webhook URL is required"
    exit 1
fi

echo ""
echo "📝 Test 1: New Design Request (PM Mode)"
echo "---------------------------------------"
echo "Sending requirements to AI..."
echo ""

RESPONSE=$(curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "STORY-TEST-001",
    "requirements": "Create a modern login page with email and password fields, a remember me checkbox, and a forgot password link. Use blue as the primary color.",
    "acceptance_criteria": [
      "Email validation",
      "Password show/hide toggle", 
      "Responsive design for mobile"
    ],
    "monday_item_id": "12345"
  }' -w "\n\nHTTP Status: %{http_code}\n" 2>&1)

echo "$RESPONSE"

echo ""
echo "✅ Check Airtable now!"
echo "   Expected: 2 new records with chat_id='STORY-TEST-001'"
echo "   - Record 1: type='pm' (your requirements)"
echo "   - Record 2: type='ai' (generated HTML)"
echo ""
read -p "Press Enter to continue to Test 2..."

echo ""
echo "🔄 Test 2: Iterate on Design (Chat Mode)"
echo "----------------------------------------"
echo "Asking AI to modify the design..."
echo ""

# Use same webhook URL but change path to /ux-chat
CHAT_URL="${WEBHOOK_URL/pm-to-ux/ux-chat}"

RESPONSE2=$(curl -X POST "$CHAT_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "STORY-TEST-001",
    "message": "Make the login button bigger and add a subtle shadow to make it stand out more"
  }' -w "\n\nHTTP Status: %{http_code}\n" 2>&1)

echo "$RESPONSE2"

echo ""
echo "✅ Check Airtable now!"
echo "   Expected: 4 total records (2 more added)"
echo "   - Record 3: type='user' (your feedback)"
echo "   - Record 4: type='ai' (updated HTML with bigger button)"
echo ""
read -p "Press Enter to continue to Test 3..."

echo ""
echo "🎨 Test 3: Another Iteration"
echo "---------------------------"
echo "Making another design change..."
echo ""

RESPONSE3=$(curl -X POST "$CHAT_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "STORY-TEST-001",
    "message": "Add a company logo placeholder at the top of the form"
  }' -w "\n\nHTTP Status: %{http_code}\n" 2>&1)

echo "$RESPONSE3"

echo ""
echo "✅ Check Airtable now!"
echo "   Expected: 6 total records (all with same chat_id)"
echo "   - Record 5: type='user' (logo request)"
echo "   - Record 6: type='ai' (HTML with logo added)"
echo ""
echo "🎉 Testing Complete!"
echo ""
echo "📊 Airtable Verification:"
echo "   - All 6 records should have chat_id='STORY-TEST-001'"
echo "   - design_version should increment: 1, 1, 2, 2, 3, 3"
echo "   - AI responses should show context awareness"
echo ""
echo "💡 The AI should remember previous changes and build on them,"
echo "   not start from scratch each time!"
