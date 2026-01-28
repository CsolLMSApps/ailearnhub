#!/bin/bash

# Test the middleware fix for login redirect functionality

echo "========================================================================"
echo "MIDDLEWARE FIX VERIFICATION"
echo "========================================================================"
echo ""

SITE_URL="https://ailearnhub.io"

echo "Testing login redirect functionality..."
echo ""

# Test 1: Check if /terms-of-service redirects to /terms
echo "Test 1: Terms of Service redirect"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/terms-of-service")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: /terms-of-service redirects successfully"
else
    echo "   ❌ FAIL: /terms-of-service returns $RESPONSE"
fi

# Test 2: Check if /privacy-policy redirects to /privacy
echo "Test 2: Privacy Policy redirect"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/privacy-policy")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: /privacy-policy redirects successfully"
else
    echo "   ❌ FAIL: /privacy-policy returns $RESPONSE"
fi

# Test 3: Check if /terms is accessible
echo "Test 3: Terms page accessibility"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/terms")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: /terms accessible"
else
    echo "   ❌ FAIL: /terms returns $RESPONSE"
fi

# Test 4: Check if /privacy is accessible
echo "Test 4: Privacy page accessibility"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/privacy")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: /privacy accessible"
else
    echo "   ❌ FAIL: /privacy returns $RESPONSE"
fi

# Test 5: Check if favicon exists
echo "Test 5: Favicon accessibility"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/favicon.ico")
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ PASS: /favicon.ico accessible"
else
    echo "   ⚠️  WARN: /favicon.ico returns $RESPONSE (will be fixed)"
fi

echo ""
echo "========================================================================"
echo "MANUAL TEST REQUIRED: Login Redirect Flow"
echo "========================================================================"
echo ""
echo "Please test manually:"
echo "1. Log out from ailearnhub.io"
echo "2. Visit: $SITE_URL/courses/chatgpt-mastery"
echo "3. Click 'Enroll Now' button"
echo "4. Login with your credentials"
echo "5. VERIFY: You are redirected back to the course page"
echo "6. VERIFY: 'Enroll Now' button is still visible"
echo "7. Click 'Enroll Now' again"
echo "8. VERIFY: Stripe checkout opens"
echo ""
