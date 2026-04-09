const fs = require('fs');
const path = require('path');

const REPO_NAME = 'decodehub';

// Function to update paths in a file
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace absolute paths with repo-name prefixed paths
  // But don't double-replace if already has repo name
  
  // /app.js -> /decodehub/app.js
  if (content.includes('"/app.js"') && !content.includes(`"/${REPO_NAME}/app.js"`)) {
    content = content.replace(/"\/app\.js"/g, `"/${REPO_NAME}/app.js"`);
    updated = true;
  }
  
  // /style.css -> /decodehub/style.css
  if (content.includes('"/style.css"') && !content.includes(`"/${REPO_NAME}/style.css"`)) {
    content = content.replace(/"\/style\.css"/g, `"/${REPO_NAME}/style.css"`);
    updated = true;
  }
  
  // /home.html -> /decodehub/home.html
  if (content.includes('"/home.html"') && !content.includes(`"/${REPO_NAME}/home.html"`)) {
    content = content.replace(/"\/home\.html"/g, `"/${REPO_NAME}/home.html"`);
    updated = true;
  }
  
  // /favicon2.png -> /decodehub/favicon2.png
  if (content.includes('"/favicon2.png"') && !content.includes(`"/${REPO_NAME}/favicon2.png"`)) {
    content = content.replace(/"\/favicon2\.png"/g, `"/${REPO_NAME}/favicon2.png"`);
    updated = true;
  }
  
  // /encode-decode/... -> /decodehub/encode-decode/...
  if (content.includes('"/encode-decode/') && !content.includes(`"/${REPO_NAME}/encode-decode/`)) {
    content = content.replace(/"\/encode-decode\//g, `"/${REPO_NAME}/encode-decode/`);
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Function to process directory recursively
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  let count = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
      count += processDirectory(fullPath);
    } else if (stat.isFile() && item.endsWith('.html')) {
      if (updateFile(fullPath)) {
        count++;
      }
    }
  }
  
  return count;
}

// Start from current directory
console.log('Updating paths for GitHub Pages...\n');
const updatedCount = processDirectory('.');
console.log(`\nDone! Updated ${updatedCount} HTML files.`);
console.log(`All paths now include /${REPO_NAME}/ prefix.`);
