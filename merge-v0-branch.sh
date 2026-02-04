#!/bin/bash
# Merge v0 Branch to Main
# This script fetches the latest v0 branch and merges it to main

set -e

echo "🔍 Fetching latest branches from GitHub..."
git fetch origin

echo ""
echo "📋 Available v0 branches:"
git branch -r | grep "origin/v0" | tail -10

echo ""
read -p "Enter the branch name to merge (e.g., v0/main-abc123): " BRANCH_NAME

if [ -z "$BRANCH_NAME" ]; then
    echo "❌ No branch name provided. Exiting."
    exit 1
fi

# Remove origin/ prefix if provided
BRANCH_NAME=${BRANCH_NAME#origin/}

echo ""
echo "✅ Merging origin/$BRANCH_NAME to main..."

# Ensure we're on main
git checkout main
git pull origin main

# Create a merge commit
git merge "origin/$BRANCH_NAME" --no-ff -m "Merge v0 updates from $BRANCH_NAME

Co-Authored-By: Warp <agent@warp.dev>"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will auto-deploy to taxu.io in ~2 minutes"
echo "📊 Check deployment status: vercel ls --scope multivitaminds-5942s-projects"
