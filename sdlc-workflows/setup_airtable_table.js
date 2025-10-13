// Airtable Table Setup Script
// This will create the Conversations table structure by inserting sample records

const AIRTABLE_TOKEN = 'YOUR_AIRTABLE_TOKEN'; // Replace with your Airtable Personal Access Token
const BASE_ID = 'appWdPrlZVItMIbs7';
const TABLE_NAME = 'Conversations'; // You need to create empty table first

async function setupTable() {
  console.log('🚀 Setting up Airtable Conversations table...\n');

  // Sample records that will create the field structure
  const records = [
    {
      fields: {
        chat_id: 'setup_001',
        type: 'pm',
        role: 'system',
        content: 'Requirements: Create a modern login page with email and password fields',
        story_id: 'STORY-001',
        requirements: 'Create a modern login page with email and password fields. Include email validation and password show/hide toggle.',
        html_output: '',
        design_version: 1,
        approval_status: 'draft',
        tokens_used: 0,
        metadata: JSON.stringify({
          acceptance_criteria: ['Email validation', 'Password toggle'],
          source: 'setup_script'
        }),
        monday_item_id: '12345',
        is_iteration: false
      }
    },
    {
      fields: {
        chat_id: 'setup_001',
        type: 'ai',
        role: 'assistant',
        content: 'I\'ve created a modern login page with the requested features.',
        story_id: 'STORY-001',
        requirements: '',
        html_output: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Login</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-100 flex items-center justify-center min-h-screen"><div class="bg-white p-8 rounded-lg shadow-md w-96"><h2 class="text-2xl font-bold mb-6">Login</h2><form><div class="mb-4"><input type="email" placeholder="Email" class="w-full px-4 py-2 border rounded" required /></div><div class="mb-4"><input type="password" placeholder="Password" class="w-full px-4 py-2 border rounded" required /></div><button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button></form></div></body></html>',
        design_version: 1,
        approval_status: 'draft',
        tokens_used: 1250,
        metadata: JSON.stringify({}),
        monday_item_id: '12345',
        is_iteration: false
      }
    },
    {
      fields: {
        chat_id: 'setup_001',
        type: 'user',
        role: 'user',
        content: 'Make the login button green and add a forgot password link',
        story_id: 'STORY-001',
        requirements: '',
        html_output: '',
        design_version: 2,
        approval_status: 'draft',
        tokens_used: 0,
        metadata: JSON.stringify({}),
        monday_item_id: '12345',
        is_iteration: true
      }
    }
  ];

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success! Created', data.records.length, 'records');
      console.log('\n📊 Your table now has these fields:');
      console.log('  - chat_id (text)');
      console.log('  - type (text)');
      console.log('  - role (text)');
      console.log('  - content (text)');
      console.log('  - story_id (text)');
      console.log('  - requirements (text)');
      console.log('  - html_output (text)');
      console.log('  - design_version (number)');
      console.log('  - approval_status (text)');
      console.log('  - tokens_used (number)');
      console.log('  - metadata (text)');
      console.log('  - monday_item_id (text)');
      console.log('  - is_iteration (boolean)');
      console.log('\n🎯 Next Steps:');
      console.log('  1. Go to Airtable and refine field types:');
      console.log('     - type: Change to Single select (user, ai, pm, system)');
      console.log('     - approval_status: Change to Single select (draft, pending, approved, rejected)');
      console.log('  2. Import workflow to n8n');
      console.log('  3. Test with curl commands!');
    } else {
      console.error('❌ Error:', data.error);
      if (data.error.type === 'TABLE_NOT_FOUND') {
        console.log('\n💡 Solution:');
        console.log('  1. Go to: https://airtable.com/appWdPrlZVItMIbs7');
        console.log('  2. Rename "Table 1" to "Conversations"');
        console.log('  3. Run this script again');
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run it
setupTable();
