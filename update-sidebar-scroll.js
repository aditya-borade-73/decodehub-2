const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'encode-decode');

const scrollScript = `
    // Save sidebar scroll position before leaving
    const sidebar = document.getElementById('sidebarList');
    if (sidebar) {
      // Restore scroll position
      const savedScroll = sessionStorage.getItem('sidebarScroll');
      if (savedScroll) {
        sidebar.scrollTop = parseInt(savedScroll);
      }
      
      // Scroll selected item into view
      const selected = sidebar.querySelector('.selected');
      if (selected) {
        selected.scrollIntoView({ block: 'center' });
      }
      
      // Save scroll position on scroll
      sidebar.addEventListener('scroll', () => {
        sessionStorage.setItem('sidebarScroll', sidebar.scrollTop);
      });
    }`;

// Get all directories in encode-decode
const dirs = fs.readdirSync(toolsDir).filter(f => {
  return fs.statSync(path.join(toolsDir, f)).isDirectory();
});

dirs.forEach(dir => {
  const indexPath = path.join(toolsDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Check if already updated
    if (!content.includes('sidebarScroll')) {
      // Find the tool configuration script and add scroll code after it
      const regex = /(const TOOL_NAME = '[^']+';)/;
      if (regex.test(content)) {
        content = content.replace(regex, `$1${scrollScript}`);
        fs.writeFileSync(indexPath, content);
        console.log(`Updated: ${dir}/index.html`);
      }
    } else {
      console.log(`Already updated: ${dir}/index.html`);
    }
  }
});

console.log('\nDone! All tool files updated with sidebar scroll saving.');
