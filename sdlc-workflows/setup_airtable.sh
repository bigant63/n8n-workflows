#!/bin/bash

# Airtable Quick Setup Script
# This will guide you through setting up the Conversations table

echo "🎯 Airtable UX Conversations - Quick Setup"
echo "=========================================="
echo ""
echo "✅ Base already exists: appWdPrlZVItMIbs7"
echo "   Name: UX Design Conversations"
echo ""
echo "📋 Now you need to set up the table structure."
echo ""
echo "Option 1: Manual Setup (Recommended - 5 minutes)"
echo "-------------------------------------------------"
echo "1. Go to: https://airtable.com/appWdPrlZVItMIbs7"
echo "2. Rename 'Table 1' to 'Conversations'"
echo "3. Add these fields:"
echo ""
echo "   Required Fields (15 total):"
echo "   ---------------------------"
echo "   1. id (Auto number) - already exists as 'Name', rename it"
echo "   2. chat_id (Single line text)"
echo "   3. created_at (Created time)"
echo "   4. type (Single select: user, ai, pm, system)"
echo "   5. role (Single line text)"
echo "   6. content (Long text)"
echo "   7. story_id (Single line text)"
echo "   8. requirements (Long text)"
echo "   9. html_output (Long text)"
echo "   10. design_version (Number)"
echo "   11. approval_status (Single select: draft, pending, approved, rejected)"
echo "   12. tokens_used (Number)"
echo "   13. metadata (Long text)"
echo "   14. monday_item_id (Single line text)"
echo "   15. is_iteration (Checkbox)"
echo ""
echo "Option 2: Use Airtable Template (Fastest - 1 minute)"
echo "-----------------------------------------------------"
echo "Copy this template URL and import:"
echo "https://airtable.com/shrXXXXXXXXXXXXXX (if we had one)"
echo ""
echo "Option 3: CSV Import (Alternative)"
echo "-----------------------------------"
echo "I can create a CSV with the structure, which you can import."
echo ""
read -p "Would you like me to create a CSV template? (y/n): " create_csv

if [ "$create_csv" = "y" ] || [ "$create_csv" = "Y" ]; then
    echo ""
    echo "Creating CSV template..."
    
    # Create CSV with headers and example data
    cat > airtable_template.csv << 'EOF'
chat_id,created_at,type,role,content,story_id,requirements,html_output,design_version,approval_status,tokens_used,metadata,monday_item_id,is_iteration
test_001,2025-01-07T10:00:00Z,pm,system,Requirements: Create login page,STORY-001,Create a login page with email and password fields,,1,draft,0,{"acceptance_criteria":["Email validation"]},12345,false
test_001,2025-01-07T10:01:00Z,ai,assistant,I've created a modern login page,STORY-001,,<!DOCTYPE html><html>...</html>,1,draft,1250,{},12345,false
EOF
    
    echo "✅ Created: airtable_template.csv"
    echo ""
    echo "To import:"
    echo "1. Go to your Airtable base"
    echo "2. Click '+' to add table"
    echo "3. Choose 'CSV file'"
    echo "4. Upload airtable_template.csv"
    echo "5. Name it 'Conversations'"
    echo "6. Adjust field types as needed"
fi

echo ""
echo "=========================================="
echo "Once table is ready:"
echo "1. Your Base ID: appWdPrlZVItMIbs7"
echo "2. Update workflow JSON with this Base ID"
echo "3. Import to n8n and test!"
echo ""
echo "Need detailed setup? See: AIRTABLE_SETUP.md"
