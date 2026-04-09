const fs = require('fs');
const path = require('path');

// Tool definitions
const tools = [
  { id: 'base64', name: 'Base64' },
  { id: 'base64url', name: 'Base64 URL' },
  { id: 'base32', name: 'Base32' },
  { id: 'unicode-escape', name: 'Unicode Escape' },
  { id: 'json-escape', name: 'JSON Escape' },
  { id: 'url-encode', name: 'URL Encode' },
  { id: 'url-full', name: 'URL Full Encode' },
  { id: 'html-entities', name: 'HTML Entities' },
  { id: 'html-full', name: 'HTML Full Encode' },
  { id: 'sha256', name: 'SHA-256' },
  { id: 'sha1', name: 'SHA-1' },
  { id: 'md5', name: 'MD5' },
  { id: 'hex', name: 'Hex' },
  { id: 'binary', name: 'Binary' },
  { id: 'octal', name: 'Octal' },
  { id: 'decimal', name: 'Decimal' },
  { id: 'ascii-codes', name: 'ASCII Codes' },
  { id: 'rot13', name: 'ROT13' },
  { id: 'rot47', name: 'ROT47' },
  { id: 'atbash', name: 'Atbash' },
  { id: 'morse', name: 'Morse Code' },
  { id: 'caesar', name: 'Caesar (ROT3)' },
];

// Create encode-decode directory
const baseDir = path.join(__dirname, 'encode-decode');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
  console.log('Created: encode-decode/');
}

// Copy index.html to encode-decode/index.html
const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
fs.writeFileSync(path.join(baseDir, 'index.html'), indexContent);
console.log('Created: encode-decode/index.html');

// For each tool, create a folder and copy the HTML file as index.html
tools.forEach(tool => {
  const folderName = tool.id;
  const toolDir = path.join(baseDir, folderName);
  
  // Create tool directory
  if (!fs.existsSync(toolDir)) {
    fs.mkdirSync(toolDir);
  }
  
  // Read the original HTML file
  const sourceFile = path.join(__dirname, `${folderName}.html`);
  if (fs.existsSync(sourceFile)) {
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Update all links to use the new URL structure
    // Change href="home.html" to href="/home.html" or "../home.html"
    content = content.replace(/href="home.html"/g, 'href="/home.html"');
    
    // Change other tool links from href="xxx.html" to href="/encode-decode/xxx"
    tools.forEach(t => {
      const oldLink = `href="${t.id}.html"`;
      const newLink = `href="/encode-decode/${t.id}"`;
      content = content.replace(new RegExp(oldLink, 'g'), newLink);
    });
    
    // Update app.js path
    content = content.replace(/src="app.js"/g, 'src="/app.js"');
    content = content.replace(/href="style.css"/g, 'href="/style.css"');
    content = content.replace(/href="favicon2.png"/g, 'href="/favicon2.png"');
    content = content.replace(/src="favicon2.png"/g, 'src="/favicon2.png"');
    
    // Write as index.html in the tool folder
    fs.writeFileSync(path.join(toolDir, 'index.html'), content);
    console.log(`Created: encode-decode/${folderName}/index.html`);
  }
});

console.log('\nDone! URL structure created.');
console.log('New URLs:');
console.log('- /encode-decode/ (main page)');
tools.forEach(tool => {
  console.log(`- /encode-decode/${tool.id}`);
});
