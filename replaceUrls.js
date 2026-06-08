const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'frontend', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

let modifiedCount = 0;

walkDir(srcDir, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // For existing template literals: `http://localhost:5000/api...` -> `${import.meta.env.VITE_API_URL}/api...`
  content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, '`${import.meta.env.VITE_API_URL}$1`');
  
  // For normal strings: 'http://localhost:5000/api...' -> `${import.meta.env.VITE_API_URL}/api...`
  content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_URL}$1`');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Modified: ${filePath}`);
  }
});

console.log(`Finished modifying ${modifiedCount} files.`);
