#!/bin/bash

# Rotate NPM token for GitHub Actions
# Run this when the token expires (~90 days)

set -e

REPO="fmaclen/svelte-currency-input"
PACKAGE="@canutin/svelte-currency-input"
TOKEN_NAME="svelte-currency-input-$(date +%s)"

echo "=== NPM Token Rotation ==="
echo ""
echo "This script will:"
echo "  1. Create a new npm granular access token"
echo "  2. Set it as NPM_TOKEN secret in GitHub Actions"
echo ""
echo "Token details:"
echo "  Name:        $TOKEN_NAME"
echo "  Package:     $PACKAGE"
echo "  Permissions: read-write"
echo "  Expires:     ~90 days"
echo "  Repository:  $REPO"
echo ""
echo "You'll be prompted for npm password and 2FA."
echo ""

npm token create \
  --name="$TOKEN_NAME" \
  --packages="$PACKAGE" \
  --packages-and-scopes-permission=read-write \
  --bypass-2fa

echo ""
echo "Copy the token above and paste it below:"
echo ""

gh secret set NPM_TOKEN --repo "$REPO"

echo ""
echo "Done! Next rotation needed in ~90 days."
