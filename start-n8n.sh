#!/bin/bash

# Load environment variables
set -a  # automatically export all variables
source ~/n8n/.env
set +a

# Display loaded N8N_ variables for debugging
echo "=== N8N Environment Variables Loaded ==="
env | grep "^N8N_" | grep -v "API_KEY\|SECRET" | head -5
echo "========================================"
echo ""

# Start n8n
exec n8n start
