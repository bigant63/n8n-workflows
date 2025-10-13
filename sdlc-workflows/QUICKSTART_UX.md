# UX Engineer Workflow - Quick Start Guide

## 🚀 Phase 1: Setup & Import

### Step 1: Import Workflow to n8n

1. **Open n8n** in your browser
2. Click **"Add Workflow"** (or ⌘+N / Ctrl+N)
3. Click the **"..."** menu → **"Import from File"**
4. Select: `/Users/anthonyhill/n8n/n8n-workflows/sdlc-workflows/02_ux_engineer_simplified.json`
5. Click **"Import"**

### Step 2: Configure OpenAI Credentials

1. In the workflow, click the **"OpenAI GPT-4"** node
2. Click **"Credential to connect with"** dropdown
3. Create new credential:
   - **Name**: OpenAI - UX Designer
   - **API Key**: Your OpenAI API key (starts with `sk-proj-...`)
4. Click **"Save"**

### Step 3: Activate Workflow

1. Toggle the **"Active"** switch at the top (it should turn blue)
2. n8n will generate webhook URLs for you

### Step 4: Get Your Webhook URLs

Click on either webhook node to see the URLs:
- **UX Chat**: `https://your-n8n-domain.com/webhook/ux-chat`
- **PM Input**: `https://your-n8n-domain.com/webhook/pm-to-ux`

---

## 🧪 Phase 2: Test It!

### Test 1: Create New Design from Requirements (PM Mode)

```bash
curl -X POST "YOUR_N8N_URL/webhook/pm-to-ux" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "STORY-001",
    "requirements": "Create a modern login page with email and password fields, a remember me checkbox, and a forgot password link. Use a clean, minimalist design with blue as the primary color.",
    "acceptance_criteria": [
      "Email field with validation",
      "Password field with show/hide toggle",
      "Remember me checkbox",
      "Forgot password link",
      "Responsive design for mobile"
    ]
  }'
```

**Expected Result**: Browser opens with a complete login page HTML

### Test 2: Iterate on Design (Chat Mode)

First, save the HTML from Test 1, then:

```bash
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Make the login button bigger and change it from blue to green",
    "session_id": "session_001",
    "current_html": "<paste the HTML from test 1 here>"
  }'
```

**Expected Result**: Updated HTML with green, larger button

### Test 3: Simple Chat Request

```bash
curl -X POST "YOUR_N8N_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a simple hero section with a headline, subheadline, and a call-to-action button",
    "session_id": "session_002"
  }'
```

---

## 🌐 Phase 3: View in Browser

### Option A: Direct Browser Test

1. Open **Postman** or **Insomnia** (REST client)
2. Create POST request to your webhook URL
3. Set Content-Type: `application/json`
4. Paste test payload
5. Send request
6. Response will be HTML - right-click → **"Preview"**

### Option B: Simple HTML Test Interface

Save this as `ux-chat-interface.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UX Engineer Chat</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">🎨 UX Engineer AI</h1>
        
        <div class="grid grid-cols-2 gap-6">
            <!-- Input Panel -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Design Request</h2>
                
                <label class="block mb-2 font-semibold">Your Request:</label>
                <textarea 
                    id="request" 
                    class="w-full border rounded p-3 mb-4 h-32"
                    placeholder="Describe what you want...&#10;Example: Create a modern pricing table with 3 tiers"
                ></textarea>
                
                <label class="block mb-2 font-semibold">Session ID (optional):</label>
                <input 
                    type="text" 
                    id="sessionId" 
                    class="w-full border rounded p-2 mb-4"
                    placeholder="session_001"
                />
                
                <button 
                    onclick="generateDesign()"
                    class="w-full bg-blue-500 text-white py-3 rounded font-bold hover:bg-blue-600"
                >
                    Generate Design
                </button>
                
                <div id="status" class="mt-4 text-sm text-gray-600"></div>
            </div>
            
            <!-- Preview Panel -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Live Preview</h2>
                    <button onclick="downloadHtml()" class="text-blue-500 hover:underline text-sm">
                        Download HTML
                    </button>
                </div>
                <iframe 
                    id="preview" 
                    class="w-full border rounded"
                    style="height: 600px;"
                    sandbox="allow-scripts"
                ></iframe>
            </div>
        </div>
    </div>

    <script>
        const WEBHOOK_URL = 'YOUR_N8N_URL/webhook/ux-chat'; // CHANGE THIS!
        let currentHtml = '';

        async function generateDesign() {
            const request = document.getElementById('request').value;
            const sessionId = document.getElementById('sessionId').value || 'session_' + Date.now();
            const status = document.getElementById('status');
            
            if (!request.trim()) {
                alert('Please enter a design request');
                return;
            }
            
            status.textContent = '⏳ Generating design...';
            
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: request,
                        session_id: sessionId,
                        current_html: currentHtml
                    })
                });
                
                const html = await response.text();
                currentHtml = html;
                
                document.getElementById('preview').srcdoc = html;
                status.textContent = '✅ Design generated! Now you can iterate...';
                
            } catch (error) {
                status.textContent = '❌ Error: ' + error.message;
                console.error(error);
            }
        }
        
        function downloadHtml() {
            if (!currentHtml) {
                alert('Generate a design first!');
                return;
            }
            
            const blob = new Blob([currentHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'design-' + Date.now() + '.html';
            a.click();
        }
        
        // Example requests
        const examples = [
            "Create a modern hero section with gradient background",
            "Build a responsive pricing table with 3 tiers",
            "Design a contact form with name, email, and message fields",
            "Make a card component for a blog post preview"
        ];
        
        console.log('💡 Try these examples:', examples);
    </script>
</body>
</html>
```

**To use:**
1. Change `YOUR_N8N_URL` to your actual n8n webhook URL
2. Open the HTML file in your browser
3. Type design requests and see instant results!

---

## 📊 Phase 4: Monitor & Debug

### Check Execution History

1. In n8n, go to **"Executions"** tab
2. Click on any execution to see:
   - Input data received
   - AI response
   - Generated HTML
   - Errors (if any)

### Common Issues & Solutions

#### Issue: "Workflow is not active"
**Solution**: Toggle the Active switch at the top of the workflow

#### Issue: "OpenAI API key not set"
**Solution**: Click OpenAI node → Set credentials

#### Issue: "Webhook URL not found"
**Solution**: Make sure workflow is active, then check webhook node for URL

#### Issue: "AI generates broken HTML"
**Solution**: The temperature is set to 0.3 for consistency, but if you get broken HTML:
- Check the "Extract & Format HTML" node execution
- The regex might need adjustment
- Try reducing max tokens if HTML is too complex

#### Issue: "Preview shows blank page"
**Solution**: 
- Check browser console for errors
- Ensure Tailwind CDN loaded (check network tab)
- Try simpler request first

---

## 🎯 What This Workflow Does

### Flow Diagram:
```
User Request → Build Context → AI Designer (GPT-4) → Extract HTML → Return Preview
```

### Key Features:
✅ **Two input modes**: PM requirements OR chat iteration  
✅ **AI-powered design**: Uses GPT-4 to generate HTML/CSS  
✅ **Tailwind CSS**: Modern utility-first styling  
✅ **Instant preview**: HTML returned directly to browser  
✅ **Session tracking**: Groups related iterations  
✅ **Version watermark**: Shows session ID and timestamp  

### What's NOT included (yet):
❌ Pinecone memory (history stored only in session)  
❌ Monday.com integration  
❌ Approval workflow  
❌ Auto-trigger SE workflow  
❌ Multi-version storage  

**These can be added in Phase 1B if needed!**

---

## 💰 Cost Estimate

Per design generation:
- GPT-4 Turbo: ~$0.03-0.08 (depends on complexity)
- n8n execution: Free (self-hosted)

**Total: ~$0.05 per design**

For 100 designs/day: ~$5/day

---

## 🚀 Next Steps

Once this works:

1. **Test thoroughly** - Try various design requests
2. **Iterate** - Test the chat mode with current_html
3. **Add features** (Phase 1B):
   - Pinecone memory for conversation history
   - Monday.com status updates
   - Approval gate before SE handoff
   - Version control system

4. **Move to SE workflow** (Phase 2)

---

## 📝 Example Design Requests to Try

### Simple:
- "Create a button that says 'Click Me' with a blue background"
- "Make a card with an image placeholder, title, and description"
- "Build a navigation bar with logo and 4 menu items"

### Medium:
- "Create a login form with email, password, and remember me checkbox"
- "Design a 3-column pricing table with Basic, Pro, and Enterprise tiers"
- "Build a hero section with headline, subheadline, and CTA button"

### Complex:
- "Create a full dashboard with sidebar navigation, top bar with user menu, and main content area with stats cards"
- "Design a complete landing page with hero, features section, testimonials, and footer"
- "Build an e-commerce product card with image gallery, price, variants selector, and add to cart button"

---

## ✅ Success Criteria

You'll know it's working when:
1. ✅ Webhook accepts POST requests
2. ✅ AI generates HTML code
3. ✅ Browser displays the design
4. ✅ You can iterate with "make it blue" type requests
5. ✅ Session tracking works across iterations

---

**Ready to test? Import the workflow and try the curl commands above!**

Need help? Check the n8n execution logs for detailed debugging.
