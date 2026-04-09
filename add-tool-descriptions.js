const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'encode-decode');

// Tool descriptions with keywords
const toolDescriptions = {
  'base64': 'Convert text to Base64 format. Used for encoding binary data, email attachments, and URL parameters.',
  'base64url': 'URL-safe Base64 encoding. Replaces + with - and / with _. Used in JWT tokens and web APIs.',
  'base32': 'Base32 encoding uses A-Z and 2-7. Common for OTP codes, 2FA, and Google Authenticator.',
  'unicode-escape': 'Convert text to Unicode escape sequences (\\uXXXX). Used in JavaScript, JSON, and programming.',
  'json-escape': 'Escape special characters for JSON. Handles quotes, newlines, and backslashes safely.',
  'url-encode': 'URL encoding for web addresses. Converts spaces to %20 and special chars to percent format.',
  'url-full': 'Full URL encoding including alphanumeric. Maximum compatibility for all URL components.',
  'html-entities': 'Convert to HTML entities like &lt; &gt; &amp;. Essential for web development and XSS prevention.',
  'html-full': 'Complete HTML encoding. Encodes all characters for maximum HTML compatibility.',
  'sha256': 'SHA-256 hash generator. Secure one-way encryption for passwords, checksums, and blockchain.',
  'sha1': 'SHA-1 hash algorithm. Creates 40-character hex digest for file verification and legacy systems.',
  'md5': 'MD5 hash generator. Fast 128-bit hash for checksums, though not recommended for security.',
  'hex': 'Convert text to hexadecimal. Base-16 encoding used in programming, colors, and binary data.',
  'binary': 'Text to binary converter. Shows 0s and 1s representation for computer science and learning.',
  'octal': 'Octal encoding (base-8). Used in Unix file permissions and legacy computing systems.',
  'decimal': 'ASCII to decimal converter. Shows numeric values for each character in text.',
  'ascii-codes': 'Get ASCII codes for characters. Standard character encoding for computers and programming.',
  'rot13': 'ROT13 cipher. Simple letter rotation used in forums for spoilers and basic obfuscation.',
  'rot47': 'ROT47 cipher. Rotates all printable ASCII characters. Stronger than ROT13 for hiding text.',
  'atbash': 'Atbash cipher. Reverses the alphabet (A↔Z). Ancient Hebrew substitution cipher.',
  'morse': 'Morse code translator. Convert text to dots and dashes. Used in telegraph and emergency signals.',
  'caesar': 'Caesar cipher (ROT3). Shifts letters by 3 positions. Famous Roman encryption method.'
};

// Get all directories in encode-decode
const dirs = fs.readdirSync(toolsDir).filter(f => {
  return fs.statSync(path.join(toolsDir, f)).isDirectory();
});

dirs.forEach(dir => {
  const indexPath = path.join(toolsDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Get tool ID from the file
    const toolIdMatch = content.match(/const TOOL_ID = '([^']+)'/);
    if (toolIdMatch) {
      const toolId = toolIdMatch[1];
      const description = toolDescriptions[toolId] || 'Encode and decode tool.';
      
      // Check if already has description
      if (!content.includes('tool-description')) {
        // Add description after the action bar, before info bar
        const actionBarEnd = '</div>\n\n        <!-- INFO BAR -->';
        const descriptionHtml = `</div>

        <!-- TOOL DESCRIPTION -->
        <div class="tool-description">
          <p>${description}</p>
        </div>

        <!-- INFO BAR -->`;
        
        content = content.replace(actionBarEnd, descriptionHtml);
        fs.writeFileSync(indexPath, content);
        console.log(`Updated: ${dir}/index.html`);
      } else {
        console.log(`Already has description: ${dir}/index.html`);
      }
    }
  }
});

console.log('\nDone! Added tool descriptions to all files.');
