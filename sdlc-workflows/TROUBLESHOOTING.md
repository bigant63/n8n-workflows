# UX Workflow - Troubleshooting Checklist

## Pre-Import Checklist

- [ ] n8n is running and accessible
- [ ] You have an OpenAI API key with credits
- [ ] You know your n8n base URL

## Import Checklist

- [ ] Workflow imported successfully (no errors)
- [ ] All nodes are visible in the canvas
- [ ] No red error indicators on nodes
- [ ] OpenAI credentials configured
- [ ] Workflow activated (toggle is blue)

## Testing Checklist

### Test 1: Webhook Accessibility
```bash
# Replace YOUR_URL with your actual n8n webhook URL
curl -X POST "YOUR_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

**Expected**: Some response (HTML or error, not 404)  
**If 404**: Workflow not active, check toggle  
**If 500**: Check execution logs in n8n

### Test 2: Simple Design Request
```bash
curl -X POST "YOUR_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a blue button that says Click Me"}'
```

**Expected**: HTML with a blue button  
**If no HTML**: Check OpenAI credentials  
**If error about tokens**: OpenAI API key needs credits

### Test 3: PM Requirements Mode
```bash
curl -X POST "YOUR_URL/webhook/pm-to-ux" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "TEST-001",
    "requirements": "Create a simple contact form with name and email fields",
    "acceptance_criteria": ["Name field required", "Email validation"]
  }'
```

**Expected**: HTML with contact form  
**If same as Test 2**: Prompt routing working, check PM webhook

## Common Issues & Fixes

### ❌ "Workflow not found" or 404
**Cause**: Workflow not activated  
**Fix**: Click the toggle at top of workflow → should turn blue

### ❌ "Could not find credentials"
**Cause**: OpenAI credentials not set  
**Fix**: 
1. Click "OpenAI GPT-4" node
2. Click credential dropdown
3. Create new or select existing
4. Add API key (starts with sk-proj- or sk-)
5. Save

### ❌ "Rate limit exceeded"
**Cause**: Too many API calls or no credits  
**Fix**: 
1. Check OpenAI dashboard for credits
2. Add payment method if needed
3. Wait if rate limited (usually 1 minute)

### ❌ "Request timeout"
**Cause**: AI taking too long  
**Fix**: 
1. Increase workflow timeout (settings)
2. Reduce max_tokens in OpenAI node (try 2000)
3. Simplify the request

### ❌ HTML preview is blank
**Cause**: Multiple possible issues  
**Fix**: 
1. Check browser console (F12) for errors
2. Verify HTML has `<html>` and `</html>` tags
3. Check if Tailwind CDN loaded (Network tab)
4. Try viewing HTML source (Ctrl+U)

### ❌ "Could not parse JSON"
**Cause**: Invalid JSON in webhook request  
**Fix**: 
1. Check JSON is valid (use jsonlint.com)
2. Ensure quotes are correct (" not ')
3. No trailing commas

### ❌ AI generates incomplete HTML
**Cause**: Token limit reached  
**Fix**: 
1. Increase max_tokens in OpenAI node (try 6000)
2. Simplify requirements
3. Break into smaller pieces

### ❌ Design doesn't match request
**Cause**: Prompt unclear or AI confusion  
**Fix**: 
1. Be more specific in requirements
2. Add examples in prompt
3. Try different wording
4. Lower temperature (try 0.2)

## Debug Process

### Step 1: Check Workflow Execution
1. Go to "Executions" tab in n8n
2. Find your test execution
3. Click to see details
4. Look for red X on nodes (errors)

### Step 2: Check Node Output
1. Click each node in execution
2. View "Input" and "Output" tabs
3. Verify data is flowing correctly
4. Check for error messages

### Step 3: Check API Response
1. Look at "AI UX Designer" node output
2. Verify it contains HTML code
3. Check if wrapped in ```html code block
4. Look at "Extract & Format HTML" node
5. Verify it extracted HTML correctly

### Step 4: Check Webhook Response
1. Look at "Return HTML Preview" node
2. Verify it's sending HTML
3. Check response headers are correct
4. Ensure Content-Type is text/html

## Verification Tests

### ✅ Workflow is Working When:
- [ ] Webhook returns HTML (not 404)
- [ ] HTML contains actual design elements
- [ ] HTML renders in browser
- [ ] Tailwind classes are applied
- [ ] Session ID appears in watermark
- [ ] Can iterate with new requests
- [ ] Both webhooks work (chat + PM)

## Performance Checks

### Response Time
- **Target**: < 10 seconds
- **Typical**: 5-8 seconds
- **If slower**: Check OpenAI API status

### Token Usage
- **Typical**: 1000-2000 tokens per request
- **Check**: OpenAI dashboard usage page
- **Optimize**: Reduce prompt length if needed

### Success Rate
- **Target**: > 95% successful
- **If lower**: Check error patterns in executions

## Getting Help

### Before Asking for Help, Have Ready:
1. Screenshot of workflow
2. Execution ID from n8n
3. Error message (full text)
4. Test command you used
5. Expected vs actual result

### Where to Ask:
- n8n Community Forum
- n8n Discord
- This documentation (search first!)

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| 404 Error | Activate workflow |
| No credentials | Add OpenAI API key |
| Blank preview | Check browser console |
| Incomplete HTML | Increase max_tokens |
| Wrong design | Be more specific |
| Timeout | Simplify request |
| Rate limit | Wait 1 minute |

## Still Stuck?

### Last Resort Checklist:
1. [ ] Delete workflow and re-import
2. [ ] Clear n8n cache (restart n8n)
3. [ ] Test with different requirements
4. [ ] Try different webhook (Postman vs curl)
5. [ ] Check n8n logs (console/terminal)
6. [ ] Verify OpenAI API key is valid
7. [ ] Test OpenAI API directly (playground)

## Success Indicators

You know it's working when you can:
1. Send a request via curl
2. Get HTML back within 10 seconds
3. Open HTML in browser
4. See a designed interface
5. Iterate with "make it blue" type requests
6. Switch between chat and PM modes

**If all above work: Phase 1 is successful! 🎉**

---

**Quick Test Command:**
```bash
curl -X POST "YOUR_URL/webhook/ux-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a big red button"}'
```

If this returns HTML with a red button → Everything works! ✅
