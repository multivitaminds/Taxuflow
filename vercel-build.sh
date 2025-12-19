#!/bin/bash
# Vercel build script - ensures clean build without v0.app fork validation

set -e

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building Next.js application..."
pnpm run build

echo "Build completed successfully"
exit 0
