#!/bin/bash

# This script generates a simple favicon for AI Learn Hub
# Orange color (#FF6F00) on transparent background

echo "Generating favicon..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not installed"
    echo "   Please install: sudo apt-get install imagemagick"
    echo "   Or download favicon manually from: https://favicon.io"
    exit 1
fi

# Generate favicon with AI Learn Hub branding
convert -size 32x32 xc:transparent \
  -font Arial-Bold -pointsize 24 \
  -fill '#FF6F00' -gravity center \
  -annotate +0+0 'AI' \
  public/favicon.ico

if [ -f "public/favicon.ico" ]; then
    echo "✅ Favicon created: public/favicon.ico"
else
    echo "❌ Favicon creation failed"
    echo "   Please create manually or download from favicon.io"
    exit 1
fi
