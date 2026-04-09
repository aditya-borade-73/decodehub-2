const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'encode-decode');

// Enhanced tool descriptions with more content and keywords
const toolDescriptions = {
  'base64': 'Base64 encoding converts binary data to ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). Widely used for email attachments, embedding images in HTML/CSS, URL parameters, API data transfer, and storing binary data in JSON/XML. Safe for transmitting data over protocols that only support text.',
  
  'base64url': 'URL-safe Base64 encoding replaces + with - and / with _. Essential for JWT tokens, OAuth tokens, URL parameters, and web API authentication. Prevents URL encoding issues while maintaining Base64 compatibility. Used in modern web authentication systems.',
  
  'base32': 'Base32 uses A-Z and 2-7 (no 0, 1, 8, 9 to avoid confusion). Standard for OTP codes, 2FA authentication, Google Authenticator, Microsoft Authenticator, and RFC 4648 compliance. Human-readable format ideal for manual entry.',
  
  'unicode-escape': 'Converts text to Unicode escape sequences (\\uXXXX format). Essential for JavaScript strings, JSON data, Python, Java, and internationalization (i18n). Supports emojis, special characters, and non-Latin scripts (Chinese, Arabic, Cyrillic).',
  
  'json-escape': 'Escapes quotes, newlines, backslashes, and control characters for valid JSON. Handles \", \\, \\n, \\t, \\r. Critical for API development, JSON APIs, data serialization, and preventing JSON parsing errors.',
  
  'url-encode': 'Percent-encoding for URLs (RFC 3986). Converts spaces to %20, special chars to %XX format. Essential for query parameters, form data, REST APIs, and web development. Prevents URL corruption and ensures proper data transmission.',
  
  'url-full': 'Complete URL encoding including alphanumeric characters. Maximum compatibility for encoding entire URLs, file paths, and data URIs. Used when standard URL encoding is insufficient for special use cases.',
  
  'html-entities': 'Converts characters to HTML entities (&lt;, &gt;, &amp;, &quot;, &#39;). Critical for XSS prevention, displaying code in HTML, email templates, and web security. Essential for web developers to prevent script injection attacks.',
  
  'html-full': 'Complete HTML encoding for all characters. Maximum compatibility for HTML email, legacy systems, and situations requiring full character encoding. Ensures content displays correctly across all browsers and email clients.',
  
  'sha256': 'SHA-256 (Secure Hash Algorithm) generates a 64-character hex digest. Industry standard for password hashing, blockchain, Bitcoin, SSL certificates, file integrity verification, and digital signatures. Cryptographically secure and irreversible.',
  
  'sha1': 'SHA-1 produces a 40-character hex hash. Used for file checksums, Git version control, legacy systems, and data verification. Note: No longer recommended for security purposes but still valid for non-critical checksums.',
  
  'md5': 'MD5 (Message Digest 5) creates a 32-character hex hash. Fast algorithm for file checksums, data integrity, duplicate detection, and caching. Widely supported but not recommended for security or password storage.',
  
  'hex': 'Hexadecimal (base-16) encoding uses 0-9 and A-F. Fundamental for programming, memory addresses, color codes (#RRGGBB), binary data representation, and low-level computing. Essential for developers and system administrators.',
  
  'binary': 'Converts text to binary code (0s and 1s). Fundamental for computer science education, understanding how computers store text, bitwise operations, and digital logic. Shows the raw binary representation of ASCII/Unicode characters.',
  
  'octal': 'Octal (base-8) uses digits 0-7. Traditional in Unix/Linux systems for file permissions (chmod), legacy computing, and embedded systems. Still relevant for system administrators and understanding Unix permission notation.',
  
  'decimal': 'ASCII to decimal converter shows numeric values (0-127) for each character. Useful for understanding character encoding, programming, ASCII tables, and educational purposes. Displays the decimal representation of standard ASCII characters.',
  
  'ascii-codes': 'Get ASCII (American Standard Code for Information Interchange) codes for characters. Standard 7-bit encoding for English letters, numbers, and symbols. Foundation of modern text encoding, used in programming, serial communication, and data protocols.',
  
  'rot13': 'ROT13 rotates letters by 13 positions (A→N, B→O). Simple Caesar cipher used in forums for spoilers, jokes, and basic text hiding. Self-reversing: applying twice returns original text. Not secure but useful for casual obfuscation.',
  
  'rot47': 'ROT47 rotates all printable ASCII characters (33-126) by 47 positions. Stronger than ROT13, hides numbers and punctuation. Used for basic text obfuscation, puzzles, and hiding content from casual viewing.',
  
  'atbash': 'Atbash is a substitution cipher that reverses the alphabet (A↔Z, B↔Y). Originated from ancient Hebrew cryptography. Used in puzzles, games, and as a simple encoding method. Easy to decode but fun for casual use.',
  
  'morse': 'Morse code uses dots (.) and dashes (-) to represent letters and numbers. Invented by Samuel Morse for telegraph communication. Still used in aviation, amateur radio, emergency signals (SOS), and as a learning tool.',
  
  'caesar': 'Caesar cipher (also called ROT3) shifts letters by 3 positions (A→D, B→E). Used by Julius Caesar for military messages. Classic introduction to cryptography. Simple but historically significant encryption method.'
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
      // Convert underscore to hyphen for lookup
      const lookupId = toolId.replace(/_/g, '-');
      const description = toolDescriptions[lookupId];
      
      if (description) {
        // Check if already has description
        if (content.includes('tool-description')) {
          // Update existing description
          const descRegex = /<div class="tool-description">[\s\S]*?<\/div>/;
          const newDesc = `<div class="tool-description">\n          <p>${description}</p>\n        </div>`;
          content = content.replace(descRegex, newDesc);
          fs.writeFileSync(indexPath, content);
          console.log(`Updated: ${dir}/index.html`);
        } else {
          // Add new description before INFO BAR - flexible whitespace
          const infoBarPattern = /(<\/div>\s*\n\s*)(<!-- INFO BAR -->)/;
          const newContent = `$1<!-- TOOL DESCRIPTION -->\n        <div class="tool-description">\n          <p>${description}</p>\n        </div>\n\n        $2`;
          if (infoBarPattern.test(content)) {
            content = content.replace(infoBarPattern, newContent);
            fs.writeFileSync(indexPath, content);
            console.log(`Added: ${dir}/index.html`);
          } else {
            console.log(`Pattern not found: ${dir}/index.html`);
          }
        }
      }
    }
  }
});

console.log('\nDone! All tool descriptions updated with enhanced content.');
