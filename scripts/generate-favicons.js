// Script to generate PNG favicons from SVG
// Run with: node scripts/generate-favicons.js

const fs = require('fs');
const path = require('path');

// SVG content from favicon.svg
const svgContent = `<svg width="512" height="512" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer hexagon -->
  <path d="M16 1L30 9.5V26.5L16 35L2 26.5V9.5L16 1Z" stroke="#1a1a1a" stroke-width="2" fill="none"/>
  <!-- Inner hexagon -->
  <path d="M16 8L24 13V23L16 28L8 23V13L16 8Z" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
  <!-- Center dot -->
  <circle cx="16" cy="18" r="2" fill="#1a1a1a"/>
</svg>`;

console.log('This script requires a library to convert SVG to PNG.');
console.log('Please use one of these options:');
console.log('');
console.log('Option 1: Install sharp and use it:');
console.log('  npm install --save-dev sharp');
console.log('');
console.log('Option 2: Use an online converter:');
console.log('  1. Open https://convertio.co/svg-png/ or similar');
console.log('  2. Upload public/favicon.svg');
console.log('  3. Convert to PNG at sizes: 180x180, 192x192, 512x512');
console.log('  4. Save as apple-touch-icon.png, favicon-192x192.png, favicon-512x512.png in public/');
console.log('');
console.log('Option 3: Use ImageMagick (if installed):');
console.log('  magick convert -background none -resize 192x192 public/favicon.svg public/favicon-192x192.png');
console.log('  magick convert -background none -resize 512x512 public/favicon.svg public/favicon-512x512.png');
console.log('  magick convert -background none -resize 180x180 public/favicon.svg public/apple-touch-icon.png');

