const fs = require('fs');
const path = require('path');

function remove(target) {
  if (!fs.existsSync(target)) return;
  const stats = fs.statSync(target);
  if (stats.isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`Removed directory: ${target}`);
  } else {
    fs.unlinkSync(target);
    console.log(`Removed file: ${target}`);
  }
}

const root = path.join(__dirname, '..');
remove(path.join(root, '.next'));
remove(path.join(root, 'node_modules', '.prisma'));
remove(path.join(root, 'node_modules', '.next'));
console.log('Clean complete.');
