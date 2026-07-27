const fs = require('fs');
const path = require('path');

function updateFavicon(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        updateFavicon(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/<link rel="icon" type="image\/webp" href="(.*?)favicon\.webp">/g, '<link rel="icon" type="image/svg+xml" href="$1favicon.svg">');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${fullPath}`);
    }
  }
}

updateFavicon(__dirname);
