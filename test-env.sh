#!/bin/bash
echo "Testing environment variables..."
source ~/n8n/.env
echo ""
echo "SPOONTACULAR_BASE_URL = $SPOONTACULAR_BASE_URL"
echo "SPOONTACULAR_API_KEY = $SPOONTACULAR_API_KEY"
echo "N8N_BLOCK_ENV_ACCESS_IN_NODE = $N8N_BLOCK_ENV_ACCESS_IN_NODE"
echo ""
echo "All environment variables starting with SPOON, MOVIE, MONDAY, GOOGLE, PINECONE:"
env | grep -E "(SPOON|MOVIE|MONDAY|GOOGLE|PINECONE)" | sort
