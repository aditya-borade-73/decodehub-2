const fs = require('fs');
const path = require('path');

// Tool definitions
const tools = [
  { id: 'base64', name: 'Base64', category: 'Text' },
  { id: 'base64url', name: 'Base64 URL', category: 'Text' },
  { id: 'base32', name: 'Base32', category: 'Text' },
  { id: 'unicode_escape', name: 'Unicode Escape', category: 'Text' },
  { id: 'json_escape', name: 'JSON Escape', category: 'Text' },
  { id: 'url_encode', name: 'URL Encode', category: 'URL' },
  { id: 'url_full', name: 'URL Full Encode', category: 'URL' },
  { id: 'html_entities', name: 'HTML Entities', category: 'HTML' },
  { id: 'html_full', name: 'HTML Full Encode', category: 'HTML' },

  { id: 'sha256', name: 'SHA-256', category: 'Hash' },
  { id: 'sha1', name: 'SHA-1', category: 'Hash' },
  { id: 'md5', name: 'MD5', category: 'Hash' },
  { id: 'hex', name: 'Hex', category: 'Binary' },
  { id: 'binary', name: 'Binary', category: 'Binary' },
  { id: 'octal', name: 'Octal', category: 'Binary' },
  { id: 'decimal', name: 'Decimal', category: 'Binary' },
  { id: 'ascii_codes', name: 'ASCII Codes', category: 'Binary' },
  { id: 'rot13', name: 'ROT13', category: 'Cipher' },
  { id: 'rot47', name: 'ROT47', category: 'Cipher' },
  { id: 'atbash', name: 'Atbash', category: 'Cipher' },
  { id: 'morse', name: 'Morse Code', category: 'Cipher' },
  { id: 'caesar', name: 'Caesar (ROT3)', category: 'Cipher' },
];

// HTML template for each tool
function generateToolHTML(tool) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${tool.name} - DevToolkit</title>
  <link rel="icon" href="favicon2.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="app">

    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <a href="home.html" class="app-icon-link">
          <div class="app-icon">
            <img src="favicon2.png" alt="logo" class="app-logo">
          </div>
        </a>
        <div class="app-title-group">
          <h1 class="app-title">Encode / Decode</h1>
          <p class="app-subtitle">All-in-one encoding toolkit</p>
        </div>
      </div>
      <div class="header-right">
        <a href="home.html" class="home-link">Home</a>
        <span class="format-count">26 formats</span>
        <button class="dark-toggle" id="darkToggle" title="Toggle dark mode" aria-label="Toggle dark mode">
          <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </div>
    </header>

    <!-- BODY -->
    <div class="body">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-inner" id="sidebarList">
          <!-- Text -->
          <div class="category-label">Text</div>
          <a href="base64.html" class="sidebar-item${tool.id === 'base64' ? ' selected' : ''}">Base64</a>
          <a href="base64url.html" class="sidebar-item${tool.id === 'base64url' ? ' selected' : ''}">Base64 URL</a>
          <a href="base32.html" class="sidebar-item${tool.id === 'base32' ? ' selected' : ''}">Base32</a>
          <a href="unicode-escape.html" class="sidebar-item${tool.id === 'unicode_escape' ? ' selected' : ''}">Unicode Escape</a>
          <a href="json-escape.html" class="sidebar-item${tool.id === 'json_escape' ? ' selected' : ''}">JSON Escape</a>
          
          <!-- URL -->
          <div class="category-label">URL</div>
          <a href="url-encode.html" class="sidebar-item${tool.id === 'url_encode' ? ' selected' : ''}">URL Encode</a>
          <a href="url-full.html" class="sidebar-item${tool.id === 'url_full' ? ' selected' : ''}">URL Full Encode</a>
          
          <!-- HTML -->
          <div class="category-label">HTML</div>
          <a href="html-entities.html" class="sidebar-item${tool.id === 'html_entities' ? ' selected' : ''}">HTML Entities</a>
          <a href="html-full.html" class="sidebar-item${tool.id === 'html_full' ? ' selected' : ''}">HTML Full Encode</a>
          
          <!-- Binary -->
          <div class="category-label">Binary</div>
          <a href="hex.html" class="sidebar-item${tool.id === 'hex' ? ' selected' : ''}">Hex</a>
          <a href="binary.html" class="sidebar-item${tool.id === 'binary' ? ' selected' : ''}">Binary</a>
          <a href="octal.html" class="sidebar-item${tool.id === 'octal' ? ' selected' : ''}">Octal</a>
          <a href="decimal.html" class="sidebar-item${tool.id === 'decimal' ? ' selected' : ''}">Decimal</a>
          <a href="ascii-codes.html" class="sidebar-item${tool.id === 'ascii_codes' ? ' selected' : ''}">ASCII Codes</a>
          
          <!-- Other -->
          <div class="category-label">Other</div>
          <a href="sha256.html" class="sidebar-item${tool.id === 'sha256' ? ' selected' : ''}">SHA-256</a>
          <a href="sha1.html" class="sidebar-item${tool.id === 'sha1' ? ' selected' : ''}">SHA-1</a>
          <a href="md5.html" class="sidebar-item${tool.id === 'md5' ? ' selected' : ''}">MD5</a>
          <a href="rot13.html" class="sidebar-item${tool.id === 'rot13' ? ' selected' : ''}">ROT13</a>
          <a href="rot47.html" class="sidebar-item${tool.id === 'rot47' ? ' selected' : ''}">ROT47</a>
          <a href="atbash.html" class="sidebar-item${tool.id === 'atbash' ? ' selected' : ''}">Atbash</a>
          <a href="morse.html" class="sidebar-item${tool.id === 'morse' ? ' selected' : ''}">Morse Code</a>
          <a href="caesar.html" class="sidebar-item${tool.id === 'caesar' ? ' selected' : ''}">Caesar (ROT3)</a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main">

        <!-- TOOL HEADER -->
        <div class="tool-header">
          <div class="breadcrumb">
            <a href="home.html">Dev Toolkit</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">${tool.category}</span>
          </div>
          <h1 class="tool-title">${tool.name} Encode / Decode</h1>
          <p class="tool-subtitle" id="toolSubtitle">Encode and decode text using ${tool.name}</p>
        </div>

        <!-- IO PANELS -->
        <div class="io-row">

          <!-- INPUT -->
          <div class="io-panel input-panel">
            <div class="io-top-bar">
              <span class="io-label">INPUT</span>
              <div class="io-top-actions">
                <button class="text-btn sample-btn" id="sampleBtn">Sample</button>
              </div>
            </div>
            <div class="textarea-wrap">
              <textarea id="inputText" placeholder="Enter text to encode or decode..." spellcheck="false"></textarea>
            </div>
          </div>

          <!-- OUTPUT -->
          <div class="io-panel output-panel">
            <div class="io-top-bar">
              <span class="io-label">OUTPUT</span>
              <div class="io-top-actions">
                <button class="text-btn copy-btn" id="copyBtn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy
                </button>
              </div>
            </div>
            <div class="textarea-wrap">
              <textarea id="outputText" placeholder="Result will appear here..." readonly spellcheck="false"></textarea>
            </div>
          </div>

        </div>

        <!-- ACTION BUTTONS -->
        <div class="action-bar">
          <div class="mode-buttons">
            <button class="action-btn encode-btn active" id="encodeBtn">Encode</button>
            <button class="action-btn decode-btn" id="decodeBtn">Decode</button>
          </div>
          <button class="text-btn clear-btn" id="clearBtn">Clear</button>
        </div>

        <!-- INFO BAR -->
        <div class="info-bar">
          <p class="info-text"><strong id="infoName"></strong> <span id="infoDesc"></span></p>
        </div>

      </main>
    </div>

  </div>

  <script>
    // Tool configuration
    const TOOL_ID = '${tool.id}';
    const TOOL_NAME = '${tool.name}';
  </script>
  <script src="app.js"></script>
</body>
</html>`;
}

// Generate all tool HTML files
console.log('Generating tool HTML files...');

tools.forEach(tool => {
  const filename = tool.id.replace(/_/g, '-') + '.html';
  const html = generateToolHTML(tool);
  fs.writeFileSync(path.join(__dirname, filename), html);
  console.log(`Created: ${filename}`);
});

console.log('Done! Generated ' + tools.length + ' tool files.');
